import { Suspense, lazy, useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion, useScroll } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import ChevronsUp from '../ui/ChevronsUp';
import HallDisplay from '../ui/HallDisplay';
import logoWhite from '../../assets/logohtl.png';
import { FLOORS } from '../../data/site';
import { useTheme } from '../../lib/theme';
import { isLiftCalled, setLiftCalled, setSceneStatus, subscribeLiftCalled } from '../../lib/sceneStatus';
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
    const trackRef = useRef(null);
    const stageRef = useRef(null);
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

    const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });

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

        const p = reduce ? 0 : scrollYProgress.get();
        const ride = solveRide(vw, vh, p);
        apply({ left: ride.left, top: ride.top, width: ride.width, open: CRACK + (1 - CRACK) * openAt(p), p, inFront: ride.inFront });
    }, [apply, reduce, scrollYProgress]);

    useEffect(() => {
        drive2d();
        const ro = new ResizeObserver(drive2d);
        ro.observe(stageRef.current);
        const off = scrollYProgress.on('change', drive2d);
        return () => {
            ro.disconnect();
            off();
        };
    }, [drive2d, scrollYProgress]);

    const callFromLobby = useCallback(() => {
        setLiftCalled(true);
        const track = trackRef.current;
        if (track) window.scrollTo({ top: track.offsetTop + (track.offsetHeight - window.innerHeight) * 0.46, behavior: 'smooth' });
    }, []);

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
        <section id="lobby" ref={trackRef} className={reduce ? 'relative h-svh' : 'relative h-[300svh]'} aria-labelledby="hero-title">
            <div ref={stageRef} className="sticky top-0 h-svh overflow-hidden bg-ground">
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
                                <p className="lettering text-[clamp(2rem,6vw,4.25rem)] text-ink">
                                    Seguridad, tecnología y continuidad operativa para su transporte vertical
                                </p>
                                <p className="mt-6 max-w-[56ch] text-base leading-relaxed text-pretty text-muted md:text-lg">
                                    Mantenimiento multimarca de ascensores, emergencias 24/7 y facility management en Lima. Cada orden de trabajo queda registrada en nuestro propio software.
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
                                    progress={scrollYProgress}
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

                    {/* Hall call station on the lobby wall: the same panel the intro uses. Pressing it
                        calls the lift, which here means riding the page to the open cabin. */}
                    <ElevatorCallButton
                        ref={stationRef}
                        lit={called}
                        onCall={reduce ? undefined : callFromLobby}
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

                {!reduce && (
                    <p
                        ref={setFade(3)}
                        className="label absolute inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] flex items-center justify-center gap-2 text-muted"
                    >
                        Deslice para abrir las puertas <ArrowDown size={14} aria-hidden="true" />
                    </p>
                )}
            </div>
        </section>
    );
}
