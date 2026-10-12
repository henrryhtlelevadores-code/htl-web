import { useCallback, useEffect, useRef, useState } from 'react';
import { animate, useReducedMotion } from 'framer-motion';
import logoWhite from '../../assets/logohtl.png';
import ElevatorCallButton from '../ui/ElevatorCallButton';
import { setLiftCalled, skipRide, whenSceneSettled } from '../../lib/sceneStatus';
import { CALL_STATION, solveRide } from './geometry';

const MIN_HOLD = 1600; // ms the lit button is shown before the cabin can arrive
const MAX_WAIT = 6000; // ms to wait for the 3D scene before going ahead with the flat doors
const AUTO_CALL = 9000; // ms without a press before the lift is called for the visitor

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

/**
 * Every load of the home route opens on a hall call panel on a dark ground. Pressing "up" lights the button
 * and calls the cabin; while the 3D scene finishes assembling behind it, the panel then travels
 * and shrinks onto the call station beside the lift, and the lobby is revealed.
 */
export default function CallIntro() {
    const reduce = useReducedMotion();
    const [phase, setPhase] = useState(() => (reduce || window.location.hash ? 'gone' : 'idle'));
    const rootRef = useRef(null);
    const plateRef = useRef(null);
    const veilRef = useRef(null);
    const copyRef = useRef(null);
    const buttonRef = useRef(null);

    // The cabin has arrived: the call light goes out on the lobby's station.
    const finish = useCallback(() => {
        setPhase('gone');
        setLiftCalled(false);
    }, []);

    // Skip: leave the intro and land on the statement hero at the end of the lift ride, without
    // playing the ride.
    const skip = useCallback(() => {
        skipRide();
        setPhase('gone');
    }, []);

    const call = useCallback(async () => {
        setLiftCalled(true);
        setPhase((p) => (p === 'idle' ? 'called' : p));
    }, []);

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
        buttonRef.current?.focus({ preventScroll: true });
        const t = setTimeout(call, AUTO_CALL);
        return () => clearTimeout(t);
    }, [phase, call]);

    // Called: hold on the lit button, wait for the cabin, then dock the panel onto the lobby's station.
    useEffect(() => {
        if (phase !== 'called') return undefined;
        let cancelled = false;
        const controls = [];
        (async () => {
            await Promise.all([new Promise((r) => setTimeout(r, MIN_HOLD)), whenSceneSettled(MAX_WAIT)]);
            if (cancelled) return;
            const plate = plateRef.current;
            const from = plate.getBoundingClientRect();
            const to = stationRect();
            const scale = Math.max(0.05, to.height / from.height);
            const dx = (to.onScreen ? to.cx : window.innerWidth - 10) - (from.left + from.width / 2);
            const dy = to.cy - (from.top + from.height / 2);
            const ease = [0.65, 0, 0.2, 1];
            controls.push(animate(copyRef.current, { opacity: 0, y: 12 }, { duration: 0.35, ease: 'easeOut' }));
            controls.push(animate(veilRef.current, { opacity: 0 }, { duration: 1.1, delay: 0.25, ease: 'easeInOut' }));
            const move = animate(plate, { x: dx, y: dy, scale }, { duration: 1.3, ease });
            controls.push(move);
            // The real station takes over as the panel lands on it.
            controls.push(animate(plate, { opacity: 0 }, { duration: 0.3, delay: 1.1, ease: 'easeOut' }));
            await move.finished;
            if (!cancelled) setTimeout(finish, 120);
        })();
        return () => {
            cancelled = true;
            controls.forEach((c) => c.stop());
        };
    }, [phase, finish]);

    if (phase === 'gone') return null;
    const lit = phase === 'called';

    return (
        <div ref={rootRef} className="fixed inset-0 z-[70] grid place-items-center overflow-hidden" role="dialog" aria-modal="true" aria-label="Llamar al ascensor">
            <div ref={veilRef} className="absolute inset-0 bg-[#0b0c0e]">
                <div className="absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.04] blur-3xl" />
            </div>

            <div className="relative flex flex-col items-center px-6 text-center">
                <div ref={copyRef} className="flex flex-col items-center">
                    <img src={logoWhite} alt="HTL Elevadores" className="h-10 w-auto sm:h-12" />
                    <p className="mt-6 min-h-[3rem] max-w-[26ch] text-base leading-snug text-white/75 sm:text-lg" aria-live="polite">
                        {lit ? 'Bienvenido a HTL Elevadores. Solicitando cabina…' : 'Presione el botón para llamar al ascensor.'}
                    </p>
                </div>

                <ElevatorCallButton
                    ref={plateRef}
                    buttonRef={buttonRef}
                    lit={lit}
                    onCall={call}
                    className="mt-6 h-[min(46svh,21rem)] will-change-transform"
                />
            </div>

            {!lit && (
                <button
                    type="button"
                    onClick={skip}
                    className="absolute bottom-[max(0.75rem,env(safe-area-inset-bottom))] right-3 flex min-h-11 items-center gap-1.5 px-3 text-xs font-medium uppercase tracking-[0.14em] text-white/45 transition-colors hover:text-white sm:right-6"
                >
                    Omitir
                    <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M2 2.5 6 6 2 9.5M7 2.5 11 6 7 9.5" />
                    </svg>
                </button>
            )}
        </div>
    );
}
