import { useEffect, useRef } from 'react';
import {
    AdditiveBlending,
    BoxGeometry,
    CanvasTexture,
    CircleGeometry,
    Color,
    CylinderGeometry,
    DirectionalLight,
    Group,
    HemisphereLight,
    Mesh,
    MeshBasicMaterial,
    MeshStandardMaterial,
    NoToneMapping,
    Path,
    PerspectiveCamera,
    PlaneGeometry,
    PMREMGenerator,
    PointLight,
    RepeatWrapping,
    Scene,
    Shape,
    ShapeGeometry,
    SRGBColorSpace,
    TextureLoader,
    WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import logoUrl from '../../assets/logohtl.png';
import steelUrl from '../../assets/textures/acero_inoxidable.webp';
import blackSteelUrl from '../../assets/textures/acero_negro.webp';
import woodUrl from '../../assets/textures/madera.webp';
import marbleUrl from '../../assets/textures/marmol.webp';
import { CRACK, DOOR_H, DOOR_W, FOV, JAMB, LEAF_TRAVEL, LEAF_Z, easeOutExpo, openAt, solveRide } from './geometry';

const CABIN = { w: 2.3, d: 1.9, h: 2.5, front: -0.16 };
const BACK_Z = CABIN.front - CABIN.d;
// The logo sits at the centre of the mirror panel, and the ride ends framed on it.
const LOGO_Y = 1.25;
const LOGO_W = 0.66;

const PALETTE = {
    dark: { bg: '#0d0e10', wall: '#0b0c0e', floor: '#040405', door: '#636970', frame: '#c2c5ca', env: 0.36, sun: 0.75, hemi: 0.22 },
    light: { bg: '#ecedef', wall: '#b9bcc1', floor: '#8e9299', door: '#e6e9ec', frame: '#ffffff', env: 0.5, sun: 0.55, hemi: 0.5 },
};

function spillTexture() {
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 256;
    const g = c.getContext('2d');
    const grad = g.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, 'rgba(255,214,190,0.9)');
    grad.addColorStop(1, 'rgba(255,214,190,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 256);
    const side = g.createLinearGradient(0, 0, 64, 0);
    side.addColorStop(0, 'rgba(0,0,0,1)');
    side.addColorStop(0.3, 'rgba(0,0,0,0)');
    side.addColorStop(0.7, 'rgba(0,0,0,0)');
    side.addColorStop(1, 'rgba(0,0,0,1)');
    g.globalCompositeOperation = 'destination-out';
    g.fillStyle = side;
    g.fillRect(0, 0, 64, 256);
    return new CanvasTexture(c);
}

// The four supplied surfaces. Each one is fetched and decoded off the main path, then handed to
// its materials; the scene reports ready only when all of them (and the logo) are in.
function loadSurface(url, repeatX = 1, repeatY = 1) {
    return new Promise((resolve) => {
        new TextureLoader().load(
            url,
            (tex) => {
                tex.colorSpace = SRGBColorSpace;
                tex.wrapS = tex.wrapT = RepeatWrapping;
                tex.repeat.set(repeatX, repeatY);
                tex.anisotropy = 4;
                resolve(tex);
            },
            undefined,
            () => resolve(null),
        );
    });
}

// Car operating panel layout, top to bottom, as on a standard cabin: floors in two columns
// counting upward, then door open / door close, then the alarm.
const COP_ROWS = [['9', '10'], ['7', '8'], ['5', '6'], ['3', '4'], ['1', '2'], ['P', null], ['open', 'close'], ['alarm', null]];
const COP_LIT = 'P';

// Legends for the buttons, drawn once on a small transparent sheet that sits over the caps.
function copLegendTexture() {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 1024;
    const g = c.getContext('2d');
    const rowH = c.height / COP_ROWS.length;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.lineCap = 'round';
    g.lineJoin = 'round';
    COP_ROWS.forEach((row, r) => {
        row.forEach((key, col) => {
            if (!key) return;
            const single = row[1] === null;
            const x = single ? 128 : 72 + col * 112;
            const y = rowH * (r + 0.5);
            const lit = key === COP_LIT;
            const ink = key === 'alarm' ? '#ffffff' : lit ? '#ff3d2e' : '#15171a';
            if (lit) {
                g.strokeStyle = '#ff3d2e';
                g.lineWidth = 7;
                g.shadowColor = '#ff3d2e';
                g.shadowBlur = 16;
                g.beginPath();
                g.arc(x, y, 42, 0, Math.PI * 2);
                g.stroke();
                g.shadowBlur = 0;
            }
            g.fillStyle = ink;
            g.strokeStyle = ink;
            g.lineWidth = 7;
            if (key === 'open' || key === 'close') {
                // Two solid triangles with clear air between them: pointing apart for open,
                // pointing at each other for close. No centre bar, which at this size fused
                // with the arrowheads into a cross.
                const outward = key === 'open';
                for (const side of [-1, 1]) {
                    const base = x + side * (outward ? 5 : 21);
                    const tip = x + side * (outward ? 21 : 5);
                    g.beginPath();
                    g.moveTo(base, y - 12);
                    g.lineTo(tip, y);
                    g.lineTo(base, y + 12);
                    g.closePath();
                    g.fill();
                }
            } else if (key === 'alarm') {
                // Bell.
                g.beginPath();
                g.moveTo(x - 20, y + 12);
                g.quadraticCurveTo(x - 16, y - 24, x, y - 24);
                g.quadraticCurveTo(x + 16, y - 24, x + 20, y + 12);
                g.closePath();
                g.fill();
                g.beginPath();
                g.arc(x, y + 20, 5, 0, Math.PI * 2);
                g.fill();
            } else {
                g.font = `700 ${key.length > 1 ? 40 : 46}px Arial, sans-serif`;
                g.fillText(key, x, y + 2);
            }
        });
    });
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return t;
}

function buildScene(scene) {
    const mats = {
        wall: new MeshStandardMaterial({ roughness: 0.9, metalness: 0 }),
        floor: new MeshStandardMaterial({ roughness: 0.32, metalness: 0.15 }),
        // acero_inoxidable: door leaves, cabin returns, handrails and skirting.
        door: new MeshStandardMaterial({ roughness: 0.36, metalness: 0.82 }),
        cabinSteel: new MeshStandardMaterial({ color: '#c9cdd2', roughness: 0.34, metalness: 0.85 }),
        rail: new MeshStandardMaterial({ color: '#ffffff', roughness: 0.2, metalness: 0.95 }),
        // acero_negro: door frame, cabin ceiling and the light housings.
        frame: new MeshStandardMaterial({ roughness: 0.42, metalness: 0.8 }),
        cabinCeiling: new MeshStandardMaterial({ color: '#b9bcc2', roughness: 0.4, metalness: 0.8 }),
        // madera: side and back walls of the cabin.
        cabinWall: new MeshStandardMaterial({ color: '#d8cdbd', roughness: 0.58, metalness: 0 }),
        // marmol: cabin floor.
        cabinFloor: new MeshStandardMaterial({ color: '#e6e0d6', roughness: 0.16, metalness: 0.05 }),
        copPlate: new MeshStandardMaterial({ color: '#9ea3aa', roughness: 0.3, metalness: 0.9 }),
        copCap: new MeshStandardMaterial({ color: '#e9ebee', roughness: 0.24, metalness: 0.85 }),
        copAlarm: new MeshStandardMaterial({ color: '#c0261b', roughness: 0.35, metalness: 0.2, emissive: '#5a0a05' }),
        mirror: new MeshStandardMaterial({ color: '#0b0c0e', roughness: 0.06, metalness: 1 }),
        shade: new MeshBasicMaterial({ color: '#000000', transparent: true, opacity: 0.55, depthWrite: false }),
        glow: new MeshBasicMaterial({ color: '#fff1dc' }),
        ledWhite: new MeshBasicMaterial({ color: '#f4f7ff' }),
        glass: new MeshStandardMaterial({ color: '#07080a', roughness: 0.12, metalness: 0.6 }),
        led: new MeshBasicMaterial({ color: '#ff3d2e' }),
        dim: new MeshBasicMaterial({ color: '#5b6068' }),
    };

    // Lobby wall with the doorway cut out of it.
    const wallShape = new Shape();
    wallShape.moveTo(-14, 0);
    wallShape.lineTo(14, 0);
    wallShape.lineTo(14, 10);
    wallShape.lineTo(-14, 10);
    wallShape.closePath();
    const jamb = JAMB;
    const hole = new Path();
    hole.moveTo(-DOOR_W / 2 - jamb, 0);
    hole.lineTo(-DOOR_W / 2 - jamb, DOOR_H + jamb);
    hole.lineTo(DOOR_W / 2 + jamb, DOOR_H + jamb);
    hole.lineTo(DOOR_W / 2 + jamb, 0);
    hole.closePath();
    wallShape.holes.push(hole);
    const wall = new Mesh(new ShapeGeometry(wallShape), mats.wall);
    wall.position.z = 0.02;
    scene.add(wall);

    const lobbyFloor = new Mesh(new PlaneGeometry(28, 24), mats.floor);
    lobbyFloor.rotation.x = -Math.PI / 2;
    lobbyFloor.position.z = 12;
    scene.add(lobbyFloor);

    // Door frame.
    const jambGeo = new BoxGeometry(jamb, DOOR_H + jamb, 0.1);
    for (const side of [-1, 1]) {
        const j = new Mesh(jambGeo, mats.frame);
        j.position.set(side * (DOOR_W / 2 + jamb / 2), (DOOR_H + jamb) / 2, 0);
        scene.add(j);
    }
    const head = new Mesh(new BoxGeometry(DOOR_W + jamb * 2, jamb, 0.1), mats.frame);
    head.position.set(0, DOOR_H + jamb / 2, 0);
    scene.add(head);
    const sill = new Mesh(new BoxGeometry(DOOR_W, 0.012, 0.09), mats.frame);
    sill.position.set(0, 0.006, -0.02);
    scene.add(sill);

    // Door leaves.
    const leafGeo = new BoxGeometry(DOOR_W / 2, DOOR_H, 0.04);
    const left = new Mesh(leafGeo, mats.door);
    const right = new Mesh(leafGeo, mats.door);
    left.position.set(-DOOR_W / 4, DOOR_H / 2, LEAF_Z);
    right.position.set(DOOR_W / 4, DOOR_H / 2, LEAF_Z);
    scene.add(left, right);

    // Cabin: wood walls, a smoked-mirror panel carrying the logo, a black-steel LED ceiling and marble.
    const cabin = new Group();
    const { w, d, h, front } = CABIN;
    const midZ = front - d / 2;

    // The floor runs past the cabin front to the threshold, so no bare strip shows at the doorway.
    const floorDepth = d + 0.15;
    const cFloor = new Mesh(new PlaneGeometry(w, floorDepth), mats.cabinFloor);
    cFloor.rotation.x = -Math.PI / 2;
    cFloor.position.set(0, 0.002, BACK_Z + floorDepth / 2);
    cabin.add(cFloor);

    const ceiling = new Mesh(new PlaneGeometry(w, d), mats.cabinCeiling);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, h, midZ);
    cabin.add(ceiling);

    // Ceiling light: one long diffuser down the middle and an indirect cove along each wall.
    const diffuser = new Mesh(new PlaneGeometry(0.5, d - 0.5), mats.glow);
    diffuser.rotation.x = Math.PI / 2;
    diffuser.position.set(0, h - 0.004, midZ);
    cabin.add(diffuser);
    for (const side of [-1, 1]) {
        const cove = new Mesh(new PlaneGeometry(0.05, d - 0.2), mats.glow);
        cove.rotation.x = Math.PI / 2;
        cove.position.set(side * (w / 2 - 0.05), h - 0.004, midZ);
        cabin.add(cove);
    }

    const sideGeo = new PlaneGeometry(d, h);
    for (const side of [-1, 1]) {
        const panel = new Mesh(sideGeo, mats.cabinWall);
        panel.rotation.y = side * -Math.PI / 2;
        panel.position.set(side * (w / 2), h / 2, midZ);
        cabin.add(panel);

        const rail = new Mesh(new CylinderGeometry(0.022, 0.022, d - 0.5, 20), mats.rail);
        rail.rotation.x = Math.PI / 2;
        rail.position.set(side * (w / 2 - 0.07), 0.95, midZ);
        cabin.add(rail);

        const skirt = new Mesh(new BoxGeometry(0.02, 0.1, d), mats.rail);
        skirt.position.set(side * (w / 2 - 0.01), 0.05, midZ);
        cabin.add(skirt);

        // Return panels that close the cabin front beside the door opening.
        const ret = new Mesh(new PlaneGeometry((w - DOOR_W) / 2 + 0.2, h), mats.cabinSteel);
        ret.position.set(side * (DOOR_W / 2 + (w - DOOR_W) / 4 + 0.1), h / 2, front);
        ret.rotation.y = Math.PI;
        cabin.add(ret);
    }

    const back = new Mesh(new PlaneGeometry(w, h), mats.cabinWall);
    back.position.set(0, h / 2, BACK_Z);
    cabin.add(back);

    const backSkirt = new Mesh(new BoxGeometry(w, 0.1, 0.02), mats.rail);
    backSkirt.position.set(0, 0.05, BACK_Z + 0.01);
    cabin.add(backSkirt);
    for (const side of [-1, 1]) {
        const backRail = new Mesh(new CylinderGeometry(0.022, 0.022, 0.56, 20), mats.rail);
        backRail.rotation.z = Math.PI / 2;
        backRail.position.set(side * 0.82, 0.95, BACK_Z + 0.07);
        cabin.add(backRail);
    }

    // Occlusion where the back wall meets the marble.
    const footShade = new Mesh(new PlaneGeometry(w, 0.3), mats.shade);
    footShade.rotation.x = -Math.PI / 2;
    footShade.position.set(0, 0.003, BACK_Z + 0.15);
    cabin.add(footShade);

    // Smoked-mirror panel in the middle of the back wall, framed in steel, with the logo on it.
    const mirror = new Mesh(new PlaneGeometry(0.86, 2.1), mats.mirror);
    mirror.position.set(0, 1.25, BACK_Z + 0.004);
    cabin.add(mirror);
    for (const side of [-1, 1]) {
        const trim = new Mesh(new BoxGeometry(0.018, 2.1, 0.014), mats.rail);
        trim.position.set(side * 0.44, 1.25, BACK_Z + 0.008);
        cabin.add(trim);
    }

    const logoMat = new MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
    const logoShadeMat = new MeshBasicMaterial({ color: '#000000', transparent: true, opacity: 0, depthWrite: false });
    let logoDone;
    const logoReady = new Promise((resolve) => { logoDone = resolve; });
    new TextureLoader().load(logoUrl, (tex) => {
        tex.colorSpace = SRGBColorSpace;
        logoMat.map = tex;
        logoMat.userData.loaded = true;
        logoMat.needsUpdate = true;
        logoShadeMat.map = tex;
        logoShadeMat.needsUpdate = true;
        scene.userData.dirty = true;
        logoDone();
    }, undefined, () => logoDone());
    const logoGeo = new PlaneGeometry(LOGO_W, LOGO_W * (286 / 657));
    const logoShade = new Mesh(logoGeo, logoShadeMat);
    logoShade.position.set(0.004, LOGO_Y - 0.007, BACK_Z + 0.007);
    cabin.add(logoShade);
    const logo = new Mesh(logoGeo, logoMat);
    logo.position.set(0, LOGO_Y, BACK_Z + 0.01);
    cabin.add(logo);

    // Car operating panel: a thin satin-steel plate with a floor display and raised round buttons on
    // a two-column grid, their legends on a sheet just above the caps. It hangs on the right-hand
    // side of the cabin, on the back wall beside the mirror: the side walls are seen edge-on from
    // the lobby, and a panel there would not be visible at all.
    const copH = 0.92;
    const copW = 0.26;
    const copX = 0.82;
    const copY = 1.55;
    const copZ = BACK_Z + 0.009;
    const cop = new Mesh(new BoxGeometry(copW, copH, 0.016), mats.copPlate);
    cop.position.set(copX, copY, copZ);
    cabin.add(cop);

    const display = new Mesh(new PlaneGeometry(0.17, 0.085), mats.glass);
    display.position.set(copX, copY + copH / 2 - 0.085, copZ + 0.0085);
    cabin.add(display);
    const readout = new Mesh(new PlaneGeometry(0.04, 0.04), mats.led);
    readout.position.set(copX, copY + copH / 2 - 0.085, copZ + 0.009);
    cabin.add(readout);

    const gridTop = copY + copH / 2 - 0.16;
    const gridH = copH - 0.2;
    const pitch = gridH / COP_ROWS.length;
    const capGeo = new CylinderGeometry(0.027, 0.03, 0.012, 28);
    COP_ROWS.forEach((row, r) => {
        row.forEach((key, col) => {
            if (!key) return;
            const single = row[1] === null;
            const cap = new Mesh(capGeo, key === 'alarm' ? mats.copAlarm : mats.copCap);
            cap.rotation.x = Math.PI / 2;
            const offset = single ? 0 : (col === 0 ? -1 : 1) * copW * (56 / 256);
            cap.position.set(copX + offset, gridTop - pitch * (r + 0.5), copZ + 0.014);
            cabin.add(cap);
        });
    });
    const legendMat = new MeshBasicMaterial({ map: copLegendTexture(), transparent: true, depthWrite: false });
    const legend = new Mesh(new PlaneGeometry(copW, gridH), legendMat);
    legend.position.set(copX, gridTop - gridH / 2, copZ + 0.0212);
    cabin.add(legend);
    scene.add(cabin);

    // Light spilling out of the cabin onto the lobby floor.
    const spillMat = new MeshBasicMaterial({ map: spillTexture(), transparent: true, blending: AdditiveBlending, depthWrite: false, opacity: 0 });
    const spill = new Mesh(new PlaneGeometry(DOOR_W * 1.5, 3.4), spillMat);
    spill.rotation.x = -Math.PI / 2;
    spill.position.set(0, 0.004, 1.75);
    scene.add(spill);

    const hemi = new HemisphereLight('#ffffff', '#202226', 0.5);
    const sun = new DirectionalLight('#ffffff', 1.2);
    sun.position.set(2.5, 5, 6);
    const cabinLight = new PointLight('#fff0dc', 9, 5, 1.6);
    cabinLight.position.set(0, h - 0.35, midZ);
    scene.add(hemi, sun, cabinLight);

    const assign = (targets) => (tex) => {
        if (!tex) return;
        for (const m of targets) {
            m.map = tex;
            m.needsUpdate = true;
        }
        scene.userData.dirty = true;
    };
    const surfacesReady = Promise.all([
        loadSurface(steelUrl).then((tex) => {
            assign([mats.cabinSteel, mats.rail])(tex);
            if (!tex) return;
            // The photo runs from near-white at the top to near-black at the foot. The doors carry
            // lettering, so they use only its upper half: brushed, with a gentler falloff.
            const doorTex = tex.clone();
            doorTex.repeat.set(1, 0.5);
            doorTex.offset.set(0, 0.5);
            doorTex.needsUpdate = true;
            assign([mats.door])(doorTex);
        }),
        loadSurface(blackSteelUrl, 2, 2).then(assign([mats.frame, mats.cabinCeiling])),
        loadSurface(woodUrl, 1.4, 1).then(assign([mats.cabinWall])),
        loadSurface(marbleUrl).then(assign([mats.cabinFloor])),
    ]);

    return { mats, left, right, spillMat, hemi, sun, logo, logoShade, logoMat, logoShadeMat, logoReady, surfacesReady };
}

// Building the scene is heavy (renderer, environment map, geometry, shader compilation). Between
// stages the work hands the main thread back, so scroll and input are handled before the next
// one starts. It never waits for the visitor to stop: the scene starts as soon as it can.
const yieldToMain = () =>
    (globalThis.scheduler?.yield ? globalThis.scheduler.yield() : new Promise((resolve) => setTimeout(resolve, 0)));

/**
 * The lobby elevator. `progress` is a framer MotionValue (0..1) driven by scroll.
 * Every rendered frame reports where the doorway is on screen through `onFrame`,
 * so the DOM lettering can ride on the doors.
 */
export default function ElevatorScene({ progress, theme, staticMode, onFrame, onReady, onFail }) {
    const canvasRef = useRef(null);
    const apiRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        let cancelled = false;
        let dispose = () => { };

        const boot = async () => {
        await yieldToMain();
        if (cancelled) return;

        let renderer;
        try {
            renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
        } catch {
            onFail?.();
            return;
        }
        renderer.outputColorSpace = SRGBColorSpace;
        renderer.toneMapping = NoToneMapping;
        dispose = () => renderer.dispose();

        const scene = new Scene();
        scene.background = new Color();
        await yieldToMain();
        if (cancelled) return;
        const pmrem = new PMREMGenerator(renderer);
        // A 64px environment is plenty for brushed steel and costs a fraction of the default to prefilter.
        const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04, 0.1, 100, { size: 64 });
        scene.environment = envTarget.texture;
        dispose = () => {
            envTarget.dispose();
            pmrem.dispose();
            renderer.dispose();
        };

        await yieldToMain();
        if (cancelled) return;
        const camera = new PerspectiveCamera(FOV, 1, 0.05, 60);
        const parts = buildScene(scene);
        let raf = 0;
        await yieldToMain();
        if (cancelled) return;

        const state = { p: progress.get(), px: 0, py: 0, tx: 0, ty: 0, vw: 1, vh: 1, visible: true, start: performance.now(), prev: performance.now(), last: '' };

        const applyTheme = (name) => {
            const c = PALETTE[name] ?? PALETTE.dark;
            scene.background.set(c.bg);
            parts.mats.wall.color.set(c.wall);
            parts.mats.floor.color.set(c.floor);
            parts.mats.door.color.set(c.door);
            parts.mats.frame.color.set(c.frame);
            scene.environmentIntensity = c.env;
            parts.sun.intensity = c.sun;
            parts.hemi.intensity = c.hemi;
            scene.userData.dirty = true;
        };

        const resize = () => {
            const rect = canvas.parentElement.getBoundingClientRect();
            state.vw = Math.max(1, rect.width);
            state.vh = Math.max(1, rect.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, state.vw < 768 ? 1.5 : 2));
            renderer.setSize(state.vw, state.vh, false);
            camera.aspect = state.vw / state.vh;
            camera.updateProjectionMatrix();
            scene.userData.dirty = true;
        };

        const frame = (now) => {
            raf = requestAnimationFrame(frame);
            if (!state.visible) return;

            const target = staticMode ? 0 : progress.get();
            // Time-based damping, so the ride feels the same at any frame rate.
            const dt = Math.min(0.1, (now - state.prev) / 1000);
            state.prev = now;
            state.p += (target - state.p) * (1 - Math.exp(-dt * 9));
            if (Math.abs(target - state.p) < 0.0004) state.p = target;
            const ease = 1 - Math.exp(-dt * 4);
            state.px += (state.tx - state.px) * ease;
            state.py += (state.ty - state.py) * ease;

            const intro = staticMode ? 1 : easeOutExpo(Math.min(1, Math.max(0, (now - state.start - 500) / 1500)));
            const crack = CRACK * intro;
            const open = crack + (1 - crack) * openAt(state.p);

            const key = `${state.p.toFixed(4)}|${state.px.toFixed(3)}|${state.py.toFixed(3)}|${intro.toFixed(3)}`;
            if (key === state.last && !scene.userData.dirty) return;
            state.last = key;
            scene.userData.dirty = false;

            const ride = solveRide(state.vw, state.vh, state.p, state.px, state.py);
            const { dolly } = ride;
            camera.position.set(ride.cam.x, ride.cam.y, ride.cam.z);

            const travel = (DOOR_W / 2) * LEAF_TRAVEL * open;
            parts.left.position.x = -DOOR_W / 4 - travel;
            parts.right.position.x = DOOR_W / 4 + travel;
            parts.spillMat.opacity = open * (1 - dolly) * 0.5;

            // The logo stays engraved on the panel while the cabin travels away.
            if (parts.logoMat.userData.loaded && parts.logoMat.opacity !== 1) {
                parts.logoMat.opacity = 1;
                parts.logoShadeMat.opacity = 0.75;
            }

            renderer.render(scene, camera);

            onFrame?.({ left: ride.left, top: ride.top, width: ride.width, open, p: state.p, inFront: ride.inFront });
        };

        const onPointer = (e) => {
            if (e.pointerType === 'touch') return;
            state.tx = (e.clientX / window.innerWidth) * 2 - 1;
            state.ty = -((e.clientY / window.innerHeight) * 2 - 1);
        };

        const io = new IntersectionObserver(([entry]) => {
            state.visible = entry.isIntersecting;
        });
        // Watch the whole hero, not the canvas: the canvas leaves the screen when the cabin travels out,
        // and the loop must keep running to bring it back.
        io.observe(canvas.closest('section') ?? canvas);
        const ro = new ResizeObserver(resize);
        ro.observe(canvas.parentElement);
        window.addEventListener('pointermove', onPointer, { passive: true });

        apiRef.current = { applyTheme };
        applyTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        resize();
        dispose = () => {
            cancelAnimationFrame(raf);
            io.disconnect();
            ro.disconnect();
            window.removeEventListener('pointermove', onPointer);
            scene.traverse((obj) => {
                obj.geometry?.dispose();
                const m = obj.material;
                if (m) {
                    m.map?.dispose();
                    m.dispose();
                }
            });
            envTarget.dispose();
            pmrem.dispose();
            renderer.dispose();
            apiRef.current = null;
        };

        // Compile the shaders off the main thread where the browser allows it, instead of
        // stalling on the first drawn frame.
        // Textures first (four surfaces and the logo, all fetched asynchronously),
        // then shaders, so the first frame the visitor sees is already complete.
        await Promise.race([Promise.all([parts.logoReady, parts.surfacesReady]), new Promise((resolve) => setTimeout(resolve, 800))]);
        if (parts.logoMat.userData.loaded) {
            parts.logoMat.opacity = 1;
            parts.logoShadeMat.opacity = 0.75;
        }
        await yieldToMain();
        try {
            await renderer.compileAsync(scene, camera);
        } catch {
            // Older drivers: the first render compiles them instead.
        }
        if (cancelled) return;

        // Take over exactly where the page is now, so the ride never has to catch up.
        state.p = staticMode ? 0 : progress.get();
        state.start = state.prev = performance.now();
        raf = requestAnimationFrame((now) => {
            frame(now);
            onReady?.();
        });
        };

        boot();
        return () => {
            cancelled = true;
            dispose();
        };
        // The scene is built once; theme changes go through apiRef below.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        apiRef.current?.applyTheme(theme);
    }, [theme]);

    return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
