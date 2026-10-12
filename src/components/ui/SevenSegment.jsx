// Segment order: a (top), b, c, d (bottom), e, f, g (middle).
const GLYPHS = {
    0: 'abcdef',
    1: 'bc',
    2: 'abdeg',
    3: 'abcdg',
    4: 'bcfg',
    5: 'acdfg',
    6: 'acdefg',
    7: 'abc',
    8: 'abcdefg',
    9: 'abcdfg',
    L: 'def',
    A: 'abcefg',
    P: 'abefg',
    '-': 'g',
};

const SEGMENTS = {
    a: '6,2 24,2 20,6 10,6',
    b: '26,4 26,23 22,21 22,8',
    c: '26,27 26,46 22,42 22,29',
    d: '6,48 24,48 20,44 10,44',
    e: '4,27 4,46 8,42 8,29',
    f: '4,4 4,23 8,21 8,8',
    g: '7,25 10,23 20,23 23,25 20,27 10,27',
};

/** One LED digit, drawn so unlit segments stay faintly visible like a real display. */
export default function SevenSegment({ char, className = '' }) {
    const lit = GLYPHS[char] ?? GLYPHS['-'];
    return (
        <svg viewBox="0 0 30 50" className={className} aria-hidden="true">
            {Object.entries(SEGMENTS).map(([key, points]) => (
                <polygon
                    key={key}
                    points={points}
                    fill="var(--led)"
                    style={{
                        opacity: lit.includes(key) ? 1 : 0.1,
                        transition: 'opacity 140ms linear',
                    }}
                />
            ))}
        </svg>
    );
}
