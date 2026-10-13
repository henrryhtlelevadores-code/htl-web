// The site's conversion events, named once here. No analytics tool is installed yet: `track`
// only queues the event in `window.dataLayer`, which stays in the page and is sent nowhere.
// When a tool is added it reads these same names (Google Tag Manager from the dataLayer,
// Plausible through `window.plausible`), so nothing else in the site has to change.
//
//   form_submit      the visit form or the complaints book handed over to WhatsApp or mail
//   whatsapp_click   any link to WhatsApp
//   phone_click      any tel: link
//   email_click      any mailto: link
//   cta_click        any link to the visit form
export function track(event, params = {}) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });
    window.plausible?.(event, { props: params });
}

const eventFor = (href) => {
    if (href.startsWith('https://wa.me/')) return 'whatsapp_click';
    if (href.startsWith('tel:')) return 'phone_click';
    if (href.startsWith('mailto:')) return 'email_click';
    if (href.endsWith('#visita')) return 'cta_click';
    return null;
};

/** One listener for every contact link on the site, present or future. */
export function initTracking() {
    document.addEventListener('click', (e) => {
        const link = e.target instanceof Element ? e.target.closest('a[href]') : null;
        const event = link && eventFor(link.getAttribute('href'));
        if (event) track(event, { label: (link.getAttribute('aria-label') || link.textContent || '').trim().slice(0, 60) });
    });
}
