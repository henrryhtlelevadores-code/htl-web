/** Tabler's circle-chevrons-up: the glyph a call button wears instead of the LED dot. */
export default function ChevronsUp({ className = 'h-5 w-5' }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`shrink-0 ${className}`}
            aria-hidden="true"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 15l3 -3l3 3" />
            <path d="M9 11l3 -3l3 3" />
            <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        </svg>
    );
}
