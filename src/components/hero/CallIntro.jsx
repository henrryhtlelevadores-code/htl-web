import { useEffect, useLayoutEffect, useState } from 'react';
import { animate, useReducedMotion } from 'framer-motion';
import { requestScene, setLiftCalled, skipRide, whenSceneSettled } from '../../lib/sceneStatus';
import { CALL_STATION, solveRide } from './geometry';

const MIN_HOLD = 1600; // ms the lit button is shown before the cabin can arrive
const MAX_WAIT = 6000; // ms to wait for the 3D scene before going ahead with the flat doors
const AUTO_CALL = 9000; // ms without a press before the lift is called for the visitor

const IDLE_COPY = 'Presione el botón para llamar al ascensor.';

// Where the hall call station of the 3D lobby sits on screen with the page at the top.
function stationRect() {
    const stage = document.querySelector('#lobby > div');
    const { width: vw, height: vh } = stage?.getBoundingClientRect() ?? { width: window.innerWidth, height: window.innerHeight };
    const ride = solveRide(vw, vh, 0);
    const pxPerMetre = ride.width / 1.9;
    const cx = vw / 2 + (CALL_STATION.x - ride.cam.x) * pxPerMetre;
    const cy = vh / 2 - (CALL_STATION.y - ride.cam.y) * pxPerMetre;
    return { cx, cy, height: CALL_STATION.h * pxPerMetre, onScreen: cx < vw - 12 };
}

// The parts of the panel in index.html.
const parts = (intro) => ({
    veil: intro.el.querySelector('.intro-veil'),
    copy: intro.el.querySelector('.intro-copy'),
    plate: intro.el.querySelector('.intro-plate'),
    up: intro.el.querySelector('.intro-up'),
});

// Puts the panel back as it is first served, for a later visit to the home page.
function rearm(intro) {
    const { veil, copy, plate, up } = parts(intro);
    for (const el of [veil, copy, plate]) el.removeAttribute('style');
    intro.el.classList.remove('is-called');
    intro.el.querySelector('p').textContent = IDLE_COPY;
    up.disabled = false;
    up.setAttribute('aria-pressed', 'false');
    intro.called = false;
    intro.skipped = false;
    intro.el.hidden = false;
}

/**
 * Every plain visit to the home route opens on a hall call panel on a dark ground. Pressing "up"
 * lights the button and calls the cabin; while the 3D scene assembles behind it, the panel then
 * travels and shrinks onto the call station beside the lift, and the lobby is revealed.
 *
 * The panel itself is static HTML in index.html, on screen before this code has loaded, with a
 * small script that already answers the press. This component renders nothing: it takes over
 * that same panel, so there is no second copy to swap in.
 */
export default function CallIntro() {
    const reduce = useReducedMotion();
    const intro = window.__intro;
    const [phase, setPhase] = useState(() => {
        if (!intro || reduce || window.location.hash) return 'gone';
        // On the first load the visitor may have pressed or skipped before the app started.
        if (intro.first) return intro.skipped || intro.el.hidden ? 'gone' : intro.called ? 'called' : 'idle';
        return 'idle';
    });

    // Take the panel over: show it again on a later visit, and listen to its two buttons.
    useLayoutEffect(() => {
        if (!intro) {
            requestScene();
            return undefined;
        }
        const skippedEarly = intro.first && intro.skipped;
        if (!intro.first && phase === 'idle') rearm(intro);
        intro.first = false;
        intro.el.hidden = phase === 'gone';
        if (phase === 'gone') {
            if (skippedEarly) skipRide();
            requestScene();
        } else if (phase === 'called') {
            setLiftCalled(true);
            requestScene();
        }
        intro.onCall = () => {
            setLiftCalled(true);
            requestScene();
            setPhase((p) => (p === 'idle' ? 'called' : p));
        };
        intro.onSkip = () => {
            skipRide();
            requestScene();
            setPhase('gone');
        };
        return () => {
            intro.onCall = null;
            intro.onSkip = null;
            // Leaving the home page mid-welcome takes the panel with it.
            intro.el.hidden = true;
        };
        // Runs once per visit to the home page: `phase` is read as it was on arrival.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [intro]);

    // Until the lift is called the page behind the panel cannot be seen, so it is not painted.
    useLayoutEffect(() => {
        const root = document.getElementById('root');
        root.style.visibility = phase === 'idle' ? 'hidden' : '';
        return () => {
            root.style.visibility = '';
        };
    }, [phase]);

    // Lock the page behind the panel, and return it to the top for the reveal.
    useEffect(() => {
        if (phase === 'gone') return undefined;
        const prev = document.documentElement.style.overflow;
        document.documentElement.style.overflow = 'hidden';
        window.scrollTo(0, 0);
        return () => {
            document.documentElement.style.overflow = prev;
        };
    }, [phase]);

    useEffect(() => {
        if (phase !== 'idle') return undefined;
        parts(intro).up.focus({ preventScroll: true });
        const t = setTimeout(() => intro.call(), AUTO_CALL);
        return () => clearTimeout(t);
    }, [phase, intro]);

    // Called: hold on the lit button, wait for the cabin, then dock the panel onto the lobby's station.
    useEffect(() => {
        if (phase !== 'called') return undefined;
        let cancelled = false;
        const controls = [];
        (async () => {
            await Promise.all([new Promise((r) => setTimeout(r, MIN_HOLD)), whenSceneSettled(MAX_WAIT)]);
            if (cancelled) return;
            const { veil, copy, plate } = parts(intro);
            const from = plate.getBoundingClientRect();
            const to = stationRect();
            const scale = Math.max(0.05, to.height / from.height);
            const dx = (to.onScreen ? to.cx : window.innerWidth - 10) - (from.left + from.width / 2);
            const dy = to.cy - (from.top + from.height / 2);
            const ease = [0.65, 0, 0.2, 1];
            controls.push(animate(copy, { opacity: 0, y: 12 }, { duration: 0.35, ease: 'easeOut' }));
            controls.push(animate(veil, { opacity: 0 }, { duration: 1.1, delay: 0.25, ease: 'easeInOut' }));
            const move = animate(plate, { x: dx, y: dy, scale }, { duration: 1.3, ease });
            controls.push(move);
            // The real station takes over as the panel lands on it.
            controls.push(animate(plate, { opacity: 0 }, { duration: 0.3, delay: 1.1, ease: 'easeOut' }));
            await move.finished;
            if (cancelled) return;
            setTimeout(() => {
                if (cancelled) return;
                // The cabin has arrived: the call light goes out on the lobby's station.
                intro.el.hidden = true;
                setPhase('gone');
                setLiftCalled(false);
            }, 120);
        })();
        return () => {
            cancelled = true;
            controls.forEach((c) => c.stop());
        };
    }, [phase, intro]);

    return null;
}
