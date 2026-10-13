import { useEffect } from 'react';
import { PAGES, SITE_URL } from '../data/seo';

const set = (selector, attr, value) => document.head.querySelector(selector)?.setAttribute(attr, value);

/** Gives the current route its own title, description and canonical address (see `PAGES`). */
export function usePageMeta(key) {
    useEffect(() => {
        const page = PAGES[key];
        if (!page) return;
        const url = `${SITE_URL}${page.path}`;
        document.title = page.title;
        set('meta[name="description"]', 'content', page.description);
        set('link[rel="canonical"]', 'href', url);
        set('meta[property="og:title"]', 'content', page.title);
        set('meta[property="og:description"]', 'content', page.description);
        set('meta[property="og:url"]', 'content', url);
        set('meta[name="twitter:title"]', 'content', page.title);
        set('meta[name="twitter:description"]', 'content', page.description);
    }, [key]);
}
