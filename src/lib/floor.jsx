import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { FLOORS } from '../data/site';

const FloorContext = createContext({ floor: FLOORS[0], direction: 'up', setFloor: () => { } });

export function FloorProvider({ children }) {
    const [floor, setFloor] = useState(FLOORS[0]);
    const [direction, setDirection] = useState('up');

    // The arrow follows the scroll: down the page is up the building.
    useEffect(() => {
        let last = window.scrollY;
        const onScroll = () => {
            const y = window.scrollY;
            if (Math.abs(y - last) < 6) return;
            setDirection(y > last ? 'up' : 'down');
            last = y;
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const value = useMemo(() => ({ floor, direction, setFloor }), [floor, direction]);
    return <FloorContext.Provider value={value}>{children}</FloorContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFloor = () => useContext(FloorContext);

/** Reports which home floor crosses the middle of the viewport. */
// eslint-disable-next-line react-refresh/only-export-components
export function useFloorTracking() {
    const { setFloor } = useFloor();
    useEffect(() => {
        const nodes = FLOORS.map((f) => document.getElementById(f.id)).filter(Boolean);
        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    const found = FLOORS.find((f) => f.id === entry.target.id);
                    if (found) setFloor(found);
                }
            },
            { rootMargin: '-50% 0px -50% 0px' },
        );
        nodes.forEach((n) => io.observe(n));
        return () => io.disconnect();
    }, [setFloor]);
}

/** For pages that are not a floor of the home building. */
// eslint-disable-next-line react-refresh/only-export-components
export function useStaticFloor(code, name) {
    const { setFloor } = useFloor();
    useEffect(() => {
        setFloor({ id: null, code, name });
    }, [code, name, setFloor]);
}
