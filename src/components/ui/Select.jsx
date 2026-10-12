import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

/** A listbox built from a button and a floating menu, so the open menu can wear
 *  the raised surface (white in light, graphite in dark) instead of the browser default. */
export default function Select({ id, value, options, onChange, 'aria-invalid': ariaInvalid, 'aria-describedby': ariaDescribedBy }) {
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(() => Math.max(0, options.indexOf(value)));
    const rootRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onPointerDown = (e) => {
            if (!rootRef.current?.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', onPointerDown);
        return () => document.removeEventListener('mousedown', onPointerDown);
    }, [open]);

    const openMenu = () => {
        setActive(Math.max(0, options.indexOf(value)));
        setOpen(true);
    };

    const commit = (option) => {
        onChange(option);
        setOpen(false);
        buttonRef.current?.focus();
    };

    const onKeyDown = (e) => {
        if (!open) {
            if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
                e.preventDefault();
                openMenu();
            }
            return;
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            setOpen(false);
            buttonRef.current?.focus();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActive((i) => Math.min(options.length - 1, i + 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActive((i) => Math.max(0, i - 1));
        } else if (e.key === 'Home') {
            e.preventDefault();
            setActive(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            setActive(options.length - 1);
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            commit(options[active]);
        }
    };

    const listId = `${id}-listbox`;

    return (
        <div ref={rootRef} className="relative">
            <button
                ref={buttonRef}
                id={id}
                type="button"
                role="combobox"
                aria-expanded={open}
                aria-haspopup="listbox"
                aria-controls={listId}
                aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
                aria-invalid={ariaInvalid}
                aria-describedby={ariaDescribedBy}
                onClick={() => (open ? setOpen(false) : openMenu())}
                onKeyDown={onKeyDown}
                className="field flex items-center justify-between gap-3 text-left"
            >
                <span className="truncate">{value}</span>
                <ChevronDown size={18} className={`shrink-0 text-on-brand-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>

            {open && (
                <ul
                    id={listId}
                    role="listbox"
                    className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-line bg-raised p-1.5 text-ink shadow-[0_30px_60px_-30px_rgb(0_0_0/0.55)]"
                >
                    {options.map((option, i) => {
                        const selected = option === value;
                        return (
                            <li
                                key={option}
                                id={`${id}-opt-${i}`}
                                role="option"
                                aria-selected={selected}
                                onMouseEnter={() => setActive(i)}
                                onClick={() => commit(option)}
                                className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-[0.95rem] transition-colors ${
                                    i === active ? 'bg-ground' : ''
                                } ${selected ? 'font-semibold' : ''}`}
                            >
                                <span>{option}</span>
                                {selected && <Check size={16} className="shrink-0 text-accent" aria-hidden="true" />}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
