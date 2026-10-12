import { useId } from 'react';

const BODY = 'M48 30h24c0 9 30 11 30 30v84a8 8 0 0 1-8 8H26a8 8 0 0 1-8-8V62c0-20 30-22 30-32z';
const GRIP = 'M81 54c6 2 11 6 11 13v8a3 3 0 0 1-3 3h-5a3 3 0 0 1-3-3z';
const LABEL = { x: 25, y: 82, w: 70, h: 56 };
const FONT = { fontFamily: '"Montserrat Variable", ui-sans-serif, sans-serif' };

// White or near-black lettering, whichever reads on the label colour.
const inkOn = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    const luma = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
    return luma > 0.62 ? '#14171a' : '#ffffff';
};

// The product name on one line, or split into the two most even ones.
const lines = (name) => {
    const words = name.split(' ');
    if (words.length === 1 || name.length <= 8) return [name];
    let best = [name];
    let gap = Infinity;
    for (let i = 1; i < words.length; i++) {
        const a = words.slice(0, i).join(' ');
        const b = words.slice(i).join(' ');
        if (Math.abs(a.length - b.length) < gap) {
            gap = Math.abs(a.length - b.length);
            best = [a, b];
        }
    }
    return best;
};

/**
 * A frosted HDPE gallon drawn to order, lit for a dark stage: the liquid tints the plastic and the
 * label is set like a Swiss industrial one, in the product's colour.
 */
export default function ProductBottle({ labelColor, liquidColor, name, category, className = '' }) {
    const id = useId();
    const ink = inkOn(labelColor);
    const text = lines(name);
    const { x, y, w, h } = LABEL;

    return (
        <svg viewBox="0 0 120 164" className={className} role="img" aria-label={`Envase de ${name}`}>
            <defs>
                <mask id={`${id}-jug`}>
                    <path d={BODY} fill="#fff" />
                    <path d={GRIP} fill="#000" />
                </mask>
                {/* Matte plastic: a broad soft falloff to both sides, no specular streak. */}
                <linearGradient id={`${id}-matte`} x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0" stopColor="#000" stopOpacity="0.2" />
                    <stop offset="0.3" stopColor="#fff" stopOpacity="0.16" />
                    <stop offset="0.62" stopColor="#000" stopOpacity="0.03" />
                    <stop offset="1" stopColor="#000" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id={`${id}-fall`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0.55" stopColor="#000" stopOpacity="0" />
                    <stop offset="1" stopColor="#000" stopOpacity="0.16" />
                </linearGradient>
                <radialGradient id={`${id}-floor`}>
                    <stop offset="0" stopColor="#000" stopOpacity="0.85" />
                    <stop offset="0.6" stopColor="#000" stopOpacity="0.35" />
                    <stop offset="1" stopColor="#000" stopOpacity="0" />
                </radialGradient>
            </defs>

            {/* Contact shadow: the gallon sits on the shelf instead of floating over it. */}
            <ellipse cx="60" cy="153" rx="50" ry="7" fill={`url(#${id}-floor)`} />

            <rect x="50" y="8" width="20" height="13" rx="1.5" fill={labelColor} />
            <rect x="50" y="8" width="20" height="13" rx="1.5" fill={`url(#${id}-matte)`} />
            <rect x="52" y="21" width="16" height="10" fill="#dfe2e5" />

            <g mask={`url(#${id}-jug)`}>
                <rect x="18" y="30" width="84" height="122" fill="#e9ebee" />
                <rect x="18" y="58" width="84" height="94" fill={liquidColor} opacity="0.6" />
                <rect x="18" y="30" width="84" height="122" fill={`url(#${id}-matte)`} />
                <rect x="18" y="30" width="84" height="122" fill={`url(#${id}-fall)`} />
            </g>
            <path d={GRIP} fill="none" stroke="#000" strokeOpacity="0.18" strokeWidth="1" />

            {/* Label */}
            <rect x={x} y={y} width={w} height={h} fill={labelColor} />
            <rect x={x} y={y} width={w} height="9" fill="#f6f6f4" />
            <text x={x + 4} y={y + 6.3} fill="#14171a" fontSize="4" fontWeight="300" letterSpacing="1.5" style={FONT}>
                PROCLEAN
            </text>
            <rect x={x + w - 8} y={y + 3} width="4" height="3" fill={labelColor} />
            {text.map((line, i) => (
                <text
                    key={line}
                    x={x + 4}
                    y={y + (text.length === 1 ? 26 : 22) + i * 9.5}
                    fill={ink}
                    fontSize="8.6"
                    fontWeight="900"
                    letterSpacing="-0.2"
                    style={{ ...FONT, textTransform: 'uppercase' }}
                    // Long names are squeezed into the label instead of running off it.
                    {...(line.length > 9 ? { textLength: w - 8, lengthAdjust: 'spacingAndGlyphs' } : {})}
                >
                    {line}
                </text>
            ))}
            <line x1={x + 4} x2={x + w - 4} y1={y + 44} y2={y + 44} stroke={ink} strokeOpacity="0.45" strokeWidth="0.4" />
            {category && (
                <text x={x + 4} y={y + 50.5} fill={ink} fillOpacity="0.85" fontSize="3.5" fontWeight="500" letterSpacing="0.7" style={{ ...FONT, textTransform: 'uppercase' }}>
                    {category}
                </text>
            )}
            <rect x={x} y={y} width={w} height={h} fill={`url(#${id}-matte)`} opacity="0.55" />
        </svg>
    );
}
