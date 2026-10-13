// Whether the hero's elevator is ready to be shown: 'pending' while the 3D scene assembles,
// then 'ready' (3D) or 'flat' (the 2D doors stand in for it). The call intro waits on this.
let status = 'pending';
const listeners = new Set();

export const getSceneStatus = () => status;

export function setSceneStatus(next) {
    if (status === next) return;
    status = next;
    listeners.forEach((fn) => fn(next));
}

/** Resolves once the scene has settled either way, or after `maxWait` ms. */
export function whenSceneSettled(maxWait) {
    return new Promise((resolve) => {
        if (status !== 'pending') {
            resolve(status);
            return;
        }
        const done = (value) => {
            clearTimeout(timer);
            listeners.delete(done);
            resolve(value);
        };
        const timer = setTimeout(() => done(status), maxWait);
        listeners.add(done);
    });
}

// Whether the 3D scene should be built. Building it is the heaviest work on the page, so it
// waits until it can be seen: at once when there is no welcome panel in front of it, otherwise
// when the lift is called. Until then only its code is downloaded.
let sceneWanted = false;
const wantListeners = new Set();

export const isSceneWanted = () => sceneWanted;

export function requestScene() {
    if (sceneWanted) return;
    sceneWanted = true;
    wantListeners.forEach((fn) => fn());
}

export function subscribeSceneWanted(fn) {
    wantListeners.add(fn);
    return () => wantListeners.delete(fn);
}

// The intro's "skip" asks the hero to land on the statement without playing the ride. The
// intro can ask before the hero is listening, so the request is kept until it is heard.
const skipListeners = new Set();
let skipPending = false;

export function skipRide() {
    if (skipListeners.size === 0) skipPending = true;
    skipListeners.forEach((fn) => fn());
}

export function onRideSkipped(fn) {
    skipListeners.add(fn);
    if (skipPending) {
        skipPending = false;
        fn();
    }
    return () => skipListeners.delete(fn);
}

// Whether the lift is being called from the intro. The station on the lobby wall shows the
// same light until the intro hands over to it.
let called = false;
const callListeners = new Set();

export const isLiftCalled = () => called;

export function setLiftCalled(next = true) {
    if (called === next) return;
    called = next;
    callListeners.forEach((fn) => fn());
}

export function subscribeLiftCalled(fn) {
    callListeners.add(fn);
    return () => callListeners.delete(fn);
}
