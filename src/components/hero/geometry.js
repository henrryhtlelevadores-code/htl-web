// Shared between the three.js scene and the DOM lettering that rides on the doors.
export const DOOR_W = 1.9;
export const DOOR_H = 2.4;
// Width of the steel frame on each side of the doors.
export const JAMB = 0.11;
// How far each leaf travels, as a fraction of its own width, when fully open.
export const LEAF_TRAVEL = 0.97;
export const CRACK = 0.006;

export const FOV = 32;
export const TAN = Math.tan((FOV * Math.PI) / 360);
// Depth of the door leaves behind the wall plane.
export const LEAF_Z = -0.1;

// Hall call station on the lobby wall, right of the door frame (metres; x and y are its centre).
export const CALL_STATION = { x: DOOR_W / 2 + JAMB + 0.2, y: 1.18, w: 0.2, h: 0.46 };

export const clamp01 = (v) => Math.min(1, Math.max(0, v));
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

// Scroll progress (0..1) to door opening and camera travel.
export const openAt = (p) => easeInOut(clamp01((p - 0.02) / 0.26));
export const dollyAt = (p) => easeInOut(clamp01((p - 0.14) / 0.3));
// After a short hold on the open cabin, it flattens into a line, and the line sweeps up the screen.
export const squashAt = (p) => easeInOut(clamp01((p - 0.5) / 0.2));
// Ease-out only: the line leaves the floor at speed and slows as the text settles.
export const sweepAt = (p) => 1 - Math.pow(1 - clamp01((p - 0.66) / 0.3), 3);

// Where the closed doorway sits on screen, in px. The camera is solved from this,
// so the DOM around the doors can be laid out without asking the scene.
export function doorwayLayout(vw, vh) {
    const aspect = DOOR_W / DOOR_H;
    let top;
    let height;
    if (vw < 1024) {
        const head = 84;
        // Only the scroll hint sits under the doors on phones and tablets.
        const reserved = Math.min(120, vh * 0.16);
        const room = vh - head - reserved;
        // The lobby is laid out as one centred unit: doors, frame, and the call station on the wall
        // to the right, mirrored by the same margin on the left so the doors stay on the centre
        // line. The frame is also capped (340px on small phones, 380px from 416px, 448px from 640px).
        const reach = CALL_STATION.x + CALL_STATION.w / 2; // metres from the centre line to the station's far edge
        const doorsForStation = (vw - 24) * (DOOR_W / (2 * reach));
        const frameCap = vw < 416 ? 340 : vw < 640 ? 380 : 448;
        const doors = Math.min(doorsForStation, frameCap * (DOOR_W / (DOOR_W + 2 * JAMB)));
        height = Math.max(200, Math.min(room, doors / aspect));
        top = head + Math.max(0, room - height) / 2;
    } else {
        height = Math.min(vh * 0.66, (vw * 0.36) / aspect);
        top = (vh - height) / 2 + 28;
    }
    const width = height * aspect;
    return { left: (vw - width) / 2, top, width, height };
}

// Where the camera is at scroll progress `p`, and where that puts the doorway on screen.
// The scene renders from `cam`; the 2D stand-in draws its doors at `rect`. Because both read the
// same numbers, swapping one for the other does not move a pixel.
export function solveRide(vw, vh, p, swayX = 0, swayY = 0) {
    const lay = doorwayLayout(vw, vh);
    const upp0 = DOOR_H / lay.height;
    const z0 = (upp0 * vh) / (2 * TAN) + LEAF_Z;
    const y0 = DOOR_H / 2 - (vh / 2 - lay.top - lay.height / 2) * upp0;
    const dolly = dollyAt(p);
    // The zoom stops where the open cabin fills the screen: fitted by height on wide screens and
    // by width on phones. It never pushes in to the logo.
    const endZ = Math.min(z0, Math.max((DOOR_H + 0.6) / (2 * TAN), (DOOR_W + 2 * JAMB + 0.1) / (2 * TAN * (vw / vh))));
    const sway = 1 - dolly;
    const cam = {
        x: swayX * 0.16 * sway,
        y: y0 + (DOOR_H / 2 + 0.1 - y0) * dolly + swayY * 0.07 * sway,
        z: z0 + (endZ - z0) * dolly,
    };
    const dist = cam.z - LEAF_Z;
    const upp = (2 * dist * TAN) / vh;
    return {
        cam,
        dolly,
        left: vw / 2 + (-DOOR_W / 2 - cam.x) / upp,
        top: vh / 2 - (DOOR_H - cam.y) / upp,
        width: DOOR_W / upp,
        inFront: dist > 0.35,
    };
}
