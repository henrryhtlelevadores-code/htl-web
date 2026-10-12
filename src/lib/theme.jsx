import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => { } });

export function ThemeProvider({ children }) {
    // index.html already set the class before first paint; read it back.
    const [theme, setTheme] = useState(() =>
        document.documentElement.classList.contains('dark') ? 'dark' : 'light',
    );

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0d0e10' : '#ecedef');
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => {
            const next = prev === 'dark' ? 'light' : 'dark';
            try {
                localStorage.setItem('theme', next);
            } catch {
                // Private mode: the choice lasts for this visit only.
            }
            return next;
        });
    }, []);

    const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);
