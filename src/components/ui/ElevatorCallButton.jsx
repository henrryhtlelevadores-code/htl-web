import steelUrl from '../../assets/textures/acero_inoxidable.webp';

const Arrow = ({ down }) => (
    <svg viewBox="0 0 24 24" className="h-[42%] w-[42%]" style={{ transform: down ? 'rotate(180deg)' : 'none' }} aria-hidden="true">
        <path d="M12 5 20 18H4z" fill="currentColor" />
    </svg>
);

const WELL = 'grid aspect-square w-[52%] place-items-center rounded-full border-2 bg-[#15171a] shadow-[inset_0_2px_6px_rgb(0_0_0/0.7)]';

/**
 * The hall call station: a brushed-steel plate with an indicator and two concave round buttons.
 * This is the one call panel of the site, used by the intro and on the lobby wall beside the lift.
 * It sizes itself from its height (set `h-*` through `className`), so it can be drawn at any scale.
 *
 * `lit` shows the "up" call as registered. With `onCall` the up button is a real button;
 * without it the whole plate is decorative.
 */
export default function ElevatorCallButton({ lit = false, onCall, label = 'Llamar al ascensor', buttonRef, className = '', style, ref }) {
    const up = `${WELL} transition-[color,box-shadow,border-color,transform] duration-300 ${lit
        ? 'border-[#ff3d2e] bg-[#1a0d0c] text-[#ff3d2e] shadow-[0_0_0_5px_rgb(255_61_46/0.22),0_0_26px_4px_rgb(255_61_46/0.55)]'
        : 'border-white/45 text-white/85'}`;

    return (
        <div
            ref={ref}
            className={`relative flex aspect-[13/30] flex-col items-center justify-center gap-[9%] rounded-[6px] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8),inset_0_0_0_1px_rgb(255_255_255/0.18)] ${className}`}
            style={{ backgroundImage: `linear-gradient(rgb(20 22 25 / 0.35), rgb(20 22 25 / 0.55)), url(${steelUrl})`, backgroundSize: 'cover', ...style }}
        >
            <span
                aria-hidden="true"
                className={`absolute top-[7%] h-[3.5%] w-[34%] rounded-full transition-colors duration-300 ${lit ? 'bg-[#ff3d2e] shadow-[0_0_14px_2px_rgb(255_61_46/0.7)]' : 'bg-black/60'}`}
            />
            {onCall ? (
                <button
                    ref={buttonRef}
                    type="button"
                    onClick={onCall}
                    disabled={lit}
                    aria-label={label}
                    aria-pressed={lit}
                    className={`${up} focus-visible:outline-white active:scale-95 ${lit ? '' : 'hover:border-white'}`}
                >
                    <Arrow />
                </button>
            ) : (
                <span aria-hidden="true" className={up}>
                    <Arrow />
                </span>
            )}
            <span aria-hidden="true" className={`${WELL} border-white/20 text-white/30`}>
                <Arrow down />
            </span>
        </div>
    );
}
