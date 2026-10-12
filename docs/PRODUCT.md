# Product

<!-- impeccable:product-schema 1 -->

Source of every fact below: the redesign brief the owner pasted on 2026-10-09, `BROCHURE HTL 2026-1.pdf`, and the code of the sibling projects `../htl-elevadores` and `../htl-mobile`. Nothing here came from an interview; facts marked *(inferred)* were not stated outright.

## Platform

web

## Users

Decision makers for buildings in Lima, Peru: property administrators, boards of residential buildings (juntas de propietarios), facility managers of commercial buildings and logistics complexes. They arrive with an elevator that fails, a contract up for renewal, or a provider they no longer trust, and need to decide whether HTL is worth a diagnostic visit. *(inferred: usually reading on a phone between other duties, sometimes on a desktop when comparing quotes)*

## Product Purpose

Marketing landing for HTL Elevadores SAC. It must turn a visitor into a booked free diagnostic visit, through the form or a WhatsApp/phone contact. Success is a qualified lead with building, equipment and contact data.

## Positioning

HTL is a multi-brand vertical-transport specialist that also covers facility management (professional cleaning chemistry and ambient scenting), and runs its field work on its own software: a management web app and a technician mobile app, so every work order leaves a trace (checklists, photos, client signature). The name is the promise: Honradez, Tecnología, Lealtad.

## Operating Context

- Elevator services: 24/7/365 emergency and rescue, preventive maintenance, corrective maintenance (repair, parts supply, stainless steel polishing), modernization by components (3 to 4 items: button panels, cameras, control boards, displays), total modernization (machine room, traction, panels), new installations, cabin refurbishment (stainless steel 304 false ceiling with LED dichroics, side and rear panels, handrails, baseboards, rear glass).
- Brands serviced per the brochure: OTIS, TKE, Schindler, KONE, BLT, PowerTech, MP, KOYO, Orona.
- ProClean cleaning line: APC, APV, Blue Window, Brilloso, Car Wash, Glimmer, Neutral Cleaner, Quick Suds, Drain Bac; odor removers (drains, bins and waste rooms, pets); accessories (graduated spray bottles, microfibers, Green Scrub and White Polish pads, Micromop, Astrolan dust mop cover, acrylic sealer). Presentations: 500 ml, 1 L, 3.8 L gallon.
- Scenting devices: Arospray (to 50 m³), Arofuser Max (to 1,200 m³), Arostyler (to 2,000 m³), Arostream (to 3,000 m³).

## Capabilities and Constraints

Software facts verified in code, safe to state:

- Web app (internal): work orders with priority and technician assignment, preventive routes that generate work orders, annual maintenance plan, per-elevator safety checklist, equipment inventory, clients and cost centers, contracts, quotations, reports with approval, roles and permissions, and a client portal per site (equipment, work orders, quotations, documents).
- Mobile app "HTL Técnicos" (Android APK 1.0.0): assigned orders, safety checklist, maintenance tasks by module, photo evidence (before / after / attention point), findings with voice notes, client signature at close, offline-first with sync queue, optional GPS at the safety step.
- Work order lifecycle: Pendiente, En curso, En revisión, Completada.

Do not claim: push notifications, QR scanning, live technician tracking, electronic invoicing with SUNAT, spare-parts or purchasing modules, charts or analytics dashboards. None exist in code.

Stack is fixed: React 19, Vite 7, Tailwind 4, react-router 7, framer-motion 12, three 0.186. Deployed on Vercel as a SPA. Existing routes to keep working: `/`, `/productos`, `/terminos-y-condiciones`, `/politicas-de-privacidad`, plus the complaints book (Libro de Reclamaciones), a legal requirement in Peru.

## Brand Commitments

- Name: HTL Elevadores (legal: HTL ELEVADORES SAC, RUC 20614626241). Facility line appears as HTL Facility Management.
- Primary colour `#810303`, with carbon, graphite, steel and neutral white as companions. Dark and light themes, with a toggle.
- Logo files: `src/assets/logohtl.png` (white, for dark grounds) and `src/assets/logohtlrojo.png` (red, for light grounds). The mark is an open elevator door.
- Hero: an interactive three.js elevator whose doors open on scroll or load and reveal the cabin or the technology proposal.
- Motto: Honradez, Tecnología, Lealtad.
- Voice: formal Spanish (usted), technical and direct.
- CTA copy, binding: "Inicie su plan de excelencia hoy. Complete el formulario y un asesor técnico se comunicará con usted para agendar una visita diagnóstica sin cargo."

## Evidence on Hand

- Metrics supplied by the owner: 10+ institutional and residential clients, 14+ units under management, 9+ active contracts, 25+ years in the vertical-transport industry.
- Contact: +51 963 207 058 (call and WhatsApp), comercial@htl-elevadores.com, fiscal address Surquillo, Lima, Perú.
- Photography cropped from the brochure in `src/assets/brochure/`: technicians at work, cabin before/after, machine room before/after, emergency rescue, ProClean containers and use scenes.
- Absent, never to be fabricated: client names or logos, testimonials, case studies, certifications, response-time figures, prices, screenshots of the real apps.

## Product Principles

1. Show the work order, not the adjective: trust comes from traceability a visitor can see.
2. One contact path, always within reach: the diagnostic visit.
3. Elevators lead; facility management and scenting are the reason to keep one provider, not a second catalog.
4. State only what the brochure, the owner or the code supports.
5. A building administrator on a phone must be able to read and act with one hand.

## Accessibility & Inclusion

WCAG 2.1 AA contrast in both themes, full keyboard access, reduced-motion respected, and the 3D scene is decoration over content that stands without it.
