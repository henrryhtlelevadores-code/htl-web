import { Suspense, lazy, useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import { animate, useMotionValue, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowUp } from 'lucide-react';
import ChevronsUp from '../ui/ChevronsUp';
import HallDisplay from '../ui/HallDisplay';
import logoWhite from '../../assets/logohtl.png';
import { FLOORS } from '../../data/site';
import { useTheme } from '../../lib/theme';
import { isLiftCalled, onRideSkipped, setSceneStatus, subscribeLiftCalled } from '../../lib/sceneStatus';
import ElevatorCallButton from '../ui/ElevatorCallButton';
import { CRACK, LEAF_TRAVEL, clamp01, doorwayLayout, openAt, solveRide, squashAt, sweepAt, CALL_STATION, DOOR_H, DOOR_W } from './geometry';


// Everything below --edge is shown; a 24% band above it feathers out, so the reveal has no hard edge.
const REVEAL_MASK = 'linear-gradient(to bottom, transparent var(--edge), #000 calc(var(--edge) + 24%))';

// If the 3D chunk cannot be fetched, report it and let the flat steel doors stand in.
function SceneUnavailable({ onFail }) {
    useEffect(() => {
        onFail?.();
    }, [onFail]);
    return null;
}

// The 3D chunk is requested the moment this module runs (index.html also preloads it), so it
// downloads in parallel with everything else instead of waiting for an idle moment.
const sceneModule = import('./ElevatorScene').catch(() => ({ default: SceneUnavailable }));
const ElevatorScene = lazy(() => sceneModule);

// The wall station is laid out at this height (px) and scaled to its on-screen size.
const STATION_BASE = 240;

// The ride down, in seconds: the doors open and the camera steps in, the open cabin holds, then
// it descends and the statement is written in. `at` places each stop of `stops` on that clock.
const RIDE_DOWN = { stops: [0, 0.48, 0.5, 1], at: [0, 0.4, 0.58, 1], duration: 6.4, delay: 0.3 };
const RIDE_UP = { duration: 3.4, delay: 0.3 };
// The "Bajar" button sits on the doors, under the lettering (fraction of the doorway height).
const GO_AT = 0.78;

// Each line is cut at a letter boundary, so the seam between the leaves never slices a glyph.
const HEADLINE = [['Su edi', 'ficio'], ['No', 'se'], ['Deti', 'ene']];

function DoorLettering({ side }) {
    const left = side === 'left';
    return (
        <p
            className={`lettering absolute inset-x-0 top-[24%] ${left ? 'pr-[1.5%] text-right' : 'pl-[1.5%] text-left'}`}
            style={{ fontSize: 'calc(var(--dw) * 0.168)', color: 'var(--door-ink)' }}
        >
            {HEADLINE.map(([l, r]) => (
                <span key={l} className="block whitespace-nowrap">{left ? l : r}</span>
            ))}
        </p>
    );
}

export default function Hero() {
    const { theme } = useTheme();
    const reduce = useReducedMotion();
    const stageRef = useRef(null);
    const goRef = useRef(null);
    const backRef = useRef(null);
    const rideRef = useRef(null);
    const cameBack = useRef(false);
    // lobby (doors closed) | riding (going down) | arrived (statement hero) | returning (going back up)
    const [ride, setRide] = useState('lobby');
    const doorwayRef = useRef(null);
    const leftRef = useRef(null);
    const rightRef = useRef(null);
    const fadeRefs = useRef([]);
    const vignetteRef = useRef(null);
    const stationRef = useRef(null);
    const called = useSyncExternalStore(subscribeLiftCalled, isLiftCalled);
    const bridgeRef = useRef(null);
    const cabinRef = useRef(null);
    const lemaRef = useRef(null);
    const baseRef = useRef({ width: 1, height: 1 });
    const [sceneState, setSceneState] = useState('loading'); // loading | ready | failed
    const sceneLive = useRef(false);
    const lineRef = useRef(null);

    // The ride is played in time, not scrubbed by the page: 0 is the closed doors, 1 the statement.
    const progress = useMotionValue(0);

    // One writer for everything that rides on the doors, fed by the scene or by the 2D fallback.
    const apply = useCallback(({ left, top, width, open, p, inFront }) => {
        const doorway = doorwayRef.current;
        if (!doorway) return;
        const scale = width / baseRef.current.width;
        doorway.style.transform = `translate3d(${left}px, ${top}px, 0) scale(${scale})`;
        doorway.style.opacity = inFront ? '1' : '0';
        const shift = open * LEAF_TRAVEL * 100;
        leftRef.current.style.transform = `translate3d(${-shift}%, 0, 0)`;
        rightRef.current.style.transform = `translate3d(${shift}%, 0, 0)`;
        // The lettering leaves with the doors instead of piling up at the jambs.
        const ink = String(1 - clamp01((open - 0.55) / 0.3));
        leftRef.current.firstElementChild.style.opacity = ink;
        rightRef.current.firstElementChild.style.opacity = ink;
        if (vignetteRef.current) vignetteRef.current.style.opacity = String(1 - clamp01(p / 0.3));
        // The call station is fixed to the lobby wall, so it follows the same camera as the doors.
        if (stationRef.current) {
            const ppm = width / DOOR_W;
            const sh = CALL_STATION.h * ppm;
            const sx = left + (CALL_STATION.x + DOOR_W / 2) * ppm - (sh * 13) / 60;
            const sy = top + (DOOR_H - CALL_STATION.y) * ppm - sh / 2;
            stationRef.current.style.transform = `translate3d(${sx}px, ${sy}px, 0) scale(${sh / STATION_BASE})`;
        }
        if (goRef.current) {
            const gy = top + width * (DOOR_H / DOOR_W) * GO_AT;
            goRef.current.style.transform = `translate3d(${left + width / 2}px, ${gy}px, 0) translate(-50%, -50%)`;
        }

        // With the interior shown, the cabin comes down: it flattens against the floor until it is a
        // single line. That line then climbs the screen, and whatever it has passed is written in:
        // the call button first, then the offer, then the statement.
        const squash = squashAt(p);
        const sweep = sweepAt(p);
        if (cabinRef.current) {
            cabinRef.current.style.transform = `scale3d(1, ${Math.max(0.002, 1 - squash)}, 1)`;
            cabinRef.current.style.opacity = String(1 - clamp01((squash - 0.72) / 0.28));
            cabinRef.current.style.visibility = squash >= 1 ? 'hidden' : 'visible';
        }
        if (lineRef.current) {
            const y = (1 - sweep) * 100;
            lineRef.current.style.top = `${Math.min(y, 99.6)}%`;
            lineRef.current.style.opacity = String(clamp01((squash - 0.6) / 0.4) * (1 - clamp01((sweep - 0.72) / 0.28)));
            // The text is not cut by the line: it fades in through a soft band that trails it, and
            // settles upward a few pixels as it appears.
            lemaRef.current.style.setProperty('--edge', `${(1 - sweep) * 124 - 24}%`);
            lemaRef.current.firstElementChild.style.transform = `translate3d(0, ${(1 - sweep) * 28}px, 0)`;
            bridgeRef.current.style.pointerEvents = sweep > 0.95 ? 'auto' : 'none';
        }

        const away = clamp01(p / 0.16);
        for (const el of fadeRefs.current) {
            if (!el) continue;
            el.style.opacity = String(1 - away);
            el.style.transform = `translate3d(0, ${away * 18}px, 0)`;
            el.style.pointerEvents = away > 0.6 ? 'none' : '';
        }
    }, []);

    // 2D driver: lays the doorway out before the scene loads, and stands in for it without WebGL.
    const drive2d = useCallback(() => {
        const stage = stageRef.current;
        if (!stage) return;
        const { width: vw, height: vh } = stage.getBoundingClientRect();
        const lay = doorwayLayout(vw, vh);
        baseRef.current = lay;
        const doorway = doorwayRef.current;
        doorway.style.width = `${lay.width}px`;
        doorway.style.height = `${lay.height}px`;
        doorway.style.setProperty('--dw', `${lay.width}px`);
        if (sceneLive.current) return;

        const p = reduce ? 0 : progress.get();
        const at = solveRide(vw, vh, p);
        apply({ left: at.left, top: at.top, width: at.width, open: CRACK + (1 - CRACK) * openAt(p), p, inFront: at.inFront });
    }, [apply, reduce, progress]);

    useEffect(() => {
        drive2d();
        const ro = new ResizeObserver(drive2d);
        ro.observe(stageRef.current);
        const off = progress.on('change', drive2d);
        return () => {
            ro.disconnect();
            off();
        };
    }, [drive2d, progress]);

    // Plays the ride to one end. The page is held at the top while it runs (see the lock below).
    const travel = useCallback((down) => {
        rideRef.current?.stop();
        setRide(down ? 'riding' : 'returning');
        window.scrollTo({ top: 0, behavior: 'auto' });
        const controls = down
            ? animate(progress, RIDE_DOWN.stops, { times: RIDE_DOWN.at, duration: RIDE_DOWN.duration, delay: RIDE_DOWN.delay, ease: 'linear' })
            : animate(progress, 0, { duration: RIDE_UP.duration, delay: RIDE_UP.delay, ease: 'linear' });
        rideRef.current = controls;
        controls.then(() => {
            if (rideRef.current !== controls) return;
            rideRef.current = null;
            setRide(down ? 'arrived' : 'lobby');
        });
    }, [progress]);
    const descend = useCallback(() => travel(true), [travel]);
    const goBack = useCallback(() => {
        cameBack.current = true;
        travel(false);
    }, [travel]);

    useEffect(() => () => rideRef.current?.stop(), []);

    // The intro's "skip" lands on the statement without the ride.
    useEffect(() => onRideSkipped(() => {
        if (reduce) return;
        rideRef.current?.stop();
        rideRef.current = null;
        progress.set(1);
        setRide('arrived');
    }), [progress, reduce]);

    // While the cabin travels the page does not scroll.
    useEffect(() => {
        if (ride !== 'riding' && ride !== 'returning') return undefined;
        const root = document.documentElement;
        const prev = root.style.overflow;
        root.style.overflow = 'hidden';
        return () => {
            root.style.overflow = prev;
        };
    }, [ride]);

    // At the closed doors, scrolling down is the same request as pressing "Bajar": the first
    // wheel notch or upward swipe on the lobby sends the cabin down instead of moving the page.
    useEffect(() => {
        if (reduce || ride === 'arrived') return undefined;
        const stage = stageRef.current;
        const atLobby = () => ride === 'lobby' && window.scrollY < 8;
        let startY = null;
        const onWheel = (e) => {
            if (e.ctrlKey) return;
            if (ride !== 'lobby') e.preventDefault();
            else if (e.deltaY > 0 && atLobby()) {
                e.preventDefault();
                descend();
            }
        };
        const onTouchStart = (e) => {
            startY = e.touches[0].clientY;
        };
        const onTouchMove = (e) => {
            if (ride !== 'lobby') {
                if (e.cancelable) e.preventDefault();
            } else if (startY !== null && startY - e.touches[0].clientY > 6 && atLobby()) {
                if (e.cancelable) e.preventDefault();
                startY = null;
                descend();
            }
        };
        stage.addEventListener('wheel', onWheel, { passive: false });
        stage.addEventListener('touchstart', onTouchStart, { passive: true });
        stage.addEventListener('touchmove', onTouchMove, { passive: false });
        return () => {
            stage.removeEventListener('wheel', onWheel);
            stage.removeEventListener('touchstart', onTouchStart);
            stage.removeEventListener('touchmove', onTouchMove);
        };
    }, [ride, reduce, descend]);

    // The control that was pressed fades out, so focus moves to the one that replaces it.
    useEffect(() => {
        if (document.activeElement && document.activeElement !== document.body) return;
        if (ride === 'arrived') backRef.current?.focus({ preventScroll: true });
        if (ride === 'lobby' && cameBack.current) {
            cameBack.current = false;
            goRef.current?.focus({ preventScroll: true });
        }
    }, [ride]);

    const onReady = useCallback(() => {
        sceneLive.current = true;
        setSceneState('ready');
        setSceneStatus('ready');
    }, []);
    const onFail = useCallback(() => {
        sceneLive.current = false;
        setSceneState('failed');
        setSceneStatus('flat');
    }, []);

    const flat = sceneState !== 'ready';
    const setFade = (i) => (el) => {
        fadeRefs.current[i] = el;
    };

    return (
        <section id="lobby" className="relative h-svh" aria-labelledby="hero-title">
            <div ref={stageRef} className="relative h-svh overflow-hidden bg-ground">
                <h1 id="hero-title" className="sr-only">Su edificio no se detiene</h1>

                {/* Institutional hero. It waits behind the cabin on the page ground of the active theme
                    and is uncovered when the cabin descends out of the shaft. */}
                {!reduce && (
                    <div
                        ref={bridgeRef}
                        className="pointer-events-none absolute inset-0 overflow-hidden bg-ground"
                    >
                        <div
                            aria-hidden="true"
                            className="absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-3xl"
                        />
                        <div
                            ref={lemaRef}
                            className="absolute inset-0 grid place-items-center px-6 pb-10 pt-20 lg:pb-0 lg:pt-0"
                            style={{ '--edge': '100%', maskImage: REVEAL_MASK, WebkitMaskImage: REVEAL_MASK }}
                        >
                            <div className="flex max-w-3xl flex-col items-center text-center">
                                {/* The only way back to the lobby: the page does not scroll up into it. */}
                                <button
                                    ref={backRef}
                                    type="button"
                                    onClick={goBack}
                                    disabled={ride !== 'arrived'}
                                    className="label mb-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-raised px-4 text-ink transition-colors hover:border-ink"
                                >
                                    <ArrowUp size={14} aria-hidden="true" /> Volver al ascensor
                                </button>
                                <p className="lettering text-[clamp(2rem,6vw,4.25rem)] text-ink">
                                    Seguridad, tecnología y continuidad operativa para su transporte vertical
                                </p>
                                <p className="mt-6 max-w-[56ch] text-base leading-relaxed text-pretty text-muted md:text-lg">
                                    Mantenimiento multimarca de ascensores, emergencias 24/7 y facility management en Lima. Cada orden de trabajo queda registrada en nuestra plataforma digital.
                                </p>
                                <Link to={{ pathname: '/', hash: '#visita' }} className="btn-call btn-call--icon mt-8">
                                    <ChevronsUp /> Agendar visita sin cargo
                                </Link>
                            </div>
                        </div>
                        {/* The line the cabin becomes. */}
                        <div
                            ref={lineRef}
                            aria-hidden="true"
                            className="absolute inset-x-0 top-full h-[2px] -translate-y-1/2 bg-led opacity-0 shadow-[0_0_28px_6px_color-mix(in_srgb,var(--led)_55%,transparent)]"
                        />
                    </div>
                )}

                {/* The cabin: the 3D scene and the lettering on its doors travel together. Its lower edge
                    carries a shadow, so the car reads as a solid body leaving the shaft. */}
                <div
                    ref={cabinRef}
                    className="absolute inset-0 origin-bottom bg-ground will-change-transform"
                >
                    <Suspense fallback={null}>
                        {sceneState !== 'failed' && (
                            <div className={`absolute inset-0 transition-opacity duration-300 ${sceneState === 'ready' ? 'opacity-100' : 'opacity-0'}`}>
                                <ElevatorScene
                                    progress={progress}
                                    theme={theme}
                                    staticMode={reduce}
                                    onFrame={apply}
                                    onReady={onReady}
                                    onFail={onFail}
                                />
                            </div>
                        )}
                    </Suspense>

                    {/* Wall light: bright over the doors, falling off to the page ground at the edges. */}
                    <div
                        ref={vignetteRef}
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0"
                        style={{ background: 'radial-gradient(ellipse 62% 70% at 50% 44%, transparent 38%, var(--ground) 100%)' }}
                    />

                    {/* Hall call station on the lobby wall: the same panel the intro uses. It rests
                        unlit; its down button lights when the ride is requested, here or from "Bajar". */}
                    <ElevatorCallButton
                        ref={stationRef}
                        lit={ride === 'lobby' ? called && 'up' : ride === 'returning' ? 'up' : 'down'}
                        onDown={reduce ? undefined : descend}
                        className="absolute left-0 top-0 origin-top-left will-change-transform"
                        style={{ height: STATION_BASE }}
                    />

                    {/* The doorway: lettering that rides on the 3D leaves, or flat steel leaves without WebGL. */}
                    <div
                        ref={doorwayRef}
                        aria-hidden="true"
                        className="absolute left-0 top-0 origin-top-left overflow-hidden will-change-transform"
                    >
                        {/* 2D interior and steel leaves. They sit exactly where the 3D ones are drawn and
                            fade out over the same 0.3s the canvas fades in. */}
                        <div
                            className={`absolute inset-0 -z-10 transition-opacity duration-300 ${flat ? 'opacity-100' : 'opacity-0'}`}
                            style={{ background: 'linear-gradient(135deg, #2b2e34 0%, #1c1e22 25%, #3a3f47 50%, #1a1c20 75%, #282c32 100%)' }}
                        >
                            <img src={logoWhite} alt="" className="absolute left-1/2 top-1/2 w-2/5 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
                        </div>
                        <div
                            ref={leftRef}
                            className={`absolute inset-y-0 left-0 w-1/2 overflow-hidden will-change-transform`}
                        >
                            <DoorLettering side="left" />
                            <span className={`door-steel absolute inset-0 -z-10 transition-opacity duration-300 ${flat ? 'opacity-100' : 'opacity-0'}`} />
                        </div>
                        <div
                            ref={rightRef}
                            className={`absolute inset-y-0 right-0 w-1/2 overflow-hidden will-change-transform`}
                        >
                            <DoorLettering side="right" />
                            <span className={`door-steel absolute inset-0 -z-10 transition-opacity duration-300 ${flat ? 'opacity-100' : 'opacity-0'}`} />
                        </div>
                    </div>
                </div>

                {/* The request to go down, on the doors under the lettering. Pressing it fades it
                    out and presses the station's down button. */}
                {!reduce && (
                    <button
                        ref={goRef}
                        type="button"
                        onClick={descend}
                        disabled={ride !== 'lobby'}
                        className={`btn-call btn-call--icon absolute left-0 top-0 will-change-transform transition-opacity duration-300 ${ride === 'lobby' ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
                    >
                        Bajar <ArrowDown size={18} aria-hidden="true" />
                    </button>
                )}

                {/* Left wall: the lobby directory. */}
                <nav
                    ref={setFade(0)}
                    aria-label="Directorio del edificio"
                    className="absolute left-10 top-1/2 hidden w-[min(19rem,calc((100vw-36vw)/2-4.5rem))] -translate-y-1/2 lg:block"
                >
                    <div className="-translate-y-2 font-montserrat">
                        <p className="label mb-3 text-muted">Directorio</p>
                        <ul className="plate">
                            {[...FLOORS].reverse().slice(0, -1).map((f) => (
                                <li key={f.id} className="border-b border-line last:border-b-0">
                                    <Link
                                        to={{ pathname: '/', hash: `#${f.id}` }}
                                        className="group flex min-h-11 items-center gap-3 border-l-2 border-transparent px-3 py-2 transition-colors hover:border-accent hover:bg-ground"
                                    >
                                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[4px] border border-line bg-ground text-[0.8rem] font-semibold tabular text-accent">
                                            {f.code}
                                        </span>
                                        <span className="text-xs font-semibold uppercase tracking-wider">{f.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>

                {/* Right wall: the hall's information screen, capped so it never outgrows the door frame. */}
                <div
                    ref={setFade(1)}
                    className="absolute right-10 top-1/2 hidden w-[min(21rem,calc((100vw-36vw)/2-5.5rem))] -translate-y-1/2 justify-center lg:flex"
                >
                    <HallDisplay className="w-full max-w-[calc(56svh*5/8)]" />
                </div>
            </div>
        </section>
    );
}
