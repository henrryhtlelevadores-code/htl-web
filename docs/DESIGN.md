---
name: HTL Elevadores
description: A building you ride. Lobby signage and cabin steel, with floors drenched in brand red.
colors:
  brand: "#810303"
  brand-deep: "#5e0202"
  on-brand: "#ffffff"
  on-brand-muted: "#f3cdc6"
  led: "#ff3d2e"
  display-glass: "#08090a"
  accent: "#810303"
  accent-dark: "#ff6a5c"
  ground: "#ecedef"
  surface: "#f6f6f7"
  raised: "#ffffff"
  line: "#c6c9ce"
  ink: "#131416"
  muted: "#4d535b"
  steel: "#8b9199"
  ground-dark: "#0d0e10"
  surface-dark: "#15171a"
  raised-dark: "#1d2024"
  line-dark: "#30343a"
  ink-dark: "#f1efec"
  muted-dark: "#a3a9b1"
  steel-dark: "#6f7680"
typography:
  display:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 6.2vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 0.94
    letterSpacing: "-0.005em"
    fontVariation: "'wdth' 66"
  headline:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 800
    lineHeight: 0.94
    letterSpacing: "-0.005em"
    fontVariation: "'wdth' 66"
  title:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    fontVariation: "'wdth' 100"
  lead:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
    fontVariation: "'wdth' 100"
  body:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    fontVariation: "'wdth' 100"
  label:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.08em"
    fontVariation: "'wdth' 78"
  button:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 700
    letterSpacing: "0.05em"
    fontVariation: "'wdth' 78"
rounded:
  none: "0"
  control: "3px"
  full: "999px"
spacing:
  gutter: "1rem"
  gutter-sm: "1.5rem"
  gutter-lg: "2.5rem"
  block: "3.5rem"
  block-lg: "4rem"
  floor: "5rem"
  floor-md: "7rem"
  touch: "2.75rem"
  control: "3.25rem"
  bar: "4rem"
components:
  button-call:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-brand}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0.75rem 1.4rem"
    height: "{spacing.control}"
  button-call-hover:
    backgroundColor: "{colors.brand-deep}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0.75rem 1.2rem"
    height: "{spacing.control}"
  button-on-brand:
    backgroundColor: "{colors.on-brand}"
    textColor: "{colors.brand}"
    rounded: "{rounded.control}"
    padding: "0 1.25rem"
    height: "3.5rem"
  plate:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  floor-plate:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.accent}"
    typography: "{typography.display}"
    rounded: "{rounded.none}"
    size: "3.5rem"
  floor-plate-on-brand:
    backgroundColor: "transparent"
    textColor: "{colors.on-brand}"
  call-ring:
    backgroundColor: "transparent"
    rounded: "{rounded.full}"
    size: "1.75rem"
  call-ring-lit:
    textColor: "{colors.led}"
  readout:
    backgroundColor: "{colors.display-glass}"
    textColor: "{colors.led}"
    rounded: "{rounded.control}"
    padding: "0 0.625rem"
    height: "2.5rem"
  field:
    backgroundColor: "rgb(0 0 0 / 0.22)"
    textColor: "{colors.on-brand}"
    rounded: "{rounded.control}"
    padding: "0.8rem 0.9rem"
    height: "{spacing.control}"
  tag:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.25rem 0.625rem"
---

# Design System: HTL Elevadores

## Overview

**Creative North Star: "The Lobby Directory"**

The site is a building and the visitor rides it. Every home section is a floor with a keyed address (L, 1 to 6), and that address appears the same way wherever the floor is named: in a ring in the navigation, on the LED readout in the top bar, on the square plate beside the section title, and in the footer directory. The material is lobby signage and cabin steel: cool neutral grounds, flat plates inside hairline frames, heavy condensed lettering, and whole floors painted in the brand red.

Density is that of a directory board, not a brochure. Content sits in ruled rows and plates on one square lattice; there are no soft cards, no gradients on surfaces, and no decorative imagery. Red arrives in two ways only: as a drench (a full floor, a block, a bar, the call button) and as light (the LED lamp, the readout, a lit ring). Both themes are the same lobby, in daylight and after hours.

Movement follows the elevator. Things open from a centre seam like a pair of doors, or travel a short distance and settle on a long expo ease. Controls press in. Reduced motion collapses the scroll ride into a still frame and swaps door reveals for fades.

**Key Characteristics:**
- Floors, not sections: each has a code, shown identically in nav, readout, section plate and footer.
- One variable family, Archivo, with the width axis doing the work of a second typeface.
- Square plates and hairline rules; the only curves are lamps, rings and a 3px ease on pressable controls.
- Red as drench or as light. Neutrals carry everything else.
- Light and dark are one token set with the same roles; only the accent red changes value.
- Door-seam reveals and an expo ease-out as the motion signature.

## Colors

Cool steel neutrals around a single oxblood red, with one bright LED red reserved for things that are lit.

### Primary
- **Cabin Red** (`brand`, #810303): the drench. Full-floor backgrounds (floors 1 and 6), the emergency block, the call button, data bars, text selection. Identical in both themes.
- **Cabin Red Deep** (`brand-deep`, #5e0202): the pressed or recessed red. Call-button hover, hover on rows that sit on a red floor, and the form panel sunk into the red floor.
- **Accent** (`accent`, #810303 in light, `accent-dark` #ff6a5c in dark): red used as ink on neutral grounds. Floor codes on plates and in directories, metric values, check marks, small icons, the focus ring and caret. It is the same red as the brand in light and a lifted coral in dark so it stays readable (6.9:1 on the dark ground).

### Secondary
- **LED Red** (`led`, #ff3d2e): light, not paint. The lamp on the call button, the seven-segment readout and its direction arrow, the border, numeral and halo of a lit ring, the active dot in a list. Identical in both themes.
- **Display Glass** (`display-glass`, #08090a): the near-black behind anything LED. The readout housing and the device bezel stay this colour in light theme too.

### Neutral
- **Ground** (#ecedef light, #0d0e10 dark): the page and the default floor.
- **Surface** (#f6f6f7 light, #15171a dark): the alternate floor. Neutral floors alternate Ground and Surface, and a Surface floor is ruled top and bottom with Line.
- **Raised** (#ffffff light, #1d2024 dark): the face of a plate.
- **Line** (#c6c9ce light, #30343a dark): every hairline. Plate frames, row rules, tag outlines, unlit dots.
- **Ink** (#131416 light, #f1efec dark): primary text. Also the fill of a completed check box and of the floating contact button, with Ground as its foreground.
- **Muted** (#4d535b light, #a3a9b1 dark): secondary text, captions, inactive rows. At least 6.6:1 on every neutral ground in both themes.
- **Steel** (#8b9199 light, #6f7680 dark): the metal outline of an unlit ring or empty check box, the scrollbar thumb. Not a reading colour. Its one lettered use, the row of serviced brand names, measures 4.2:1 in dark and 2.7:1 in light; do not extend it to other text.
- **On Brand** (#ffffff) and **On Brand Muted** (#f3cdc6): the only two text colours on a red ground, for headings and for supporting copy (7.4:1 on Cabin Red).

### Named Rules
**The Drench or Light Rule.** Red is either a whole surface (Cabin Red) or a lamp (LED Red). It is never a tint, a gradient, a border accent or a wash behind text.

**The Ink Swap Rule.** Red text on a neutral ground uses Accent, never Cabin Red directly; Cabin Red on the dark ground is unreadable. On a red ground, text is On Brand or On Brand Muted and nothing else.

**The Same Lobby Rule.** A theme changes values, never roles. Cabin Red, LED Red, Display Glass and the white ground under product bottles do not change between themes.

## Typography

**Display Font:** Archivo Variable at 66% width (with ui-sans-serif, system-ui, sans-serif)
**Body Font:** Archivo Variable at 100% width
**Label Font:** Archivo Variable at 78% width

**Character:** One grotesque, three widths. Squeezed narrow and set heavy in capitals it reads as directory lettering cut into a board; at normal width it is a plain, legible reading face. Width is set with `font-stretch`, and the family is self-hosted with its width and weight axes.

### Hierarchy
- **Display** (800, 66% width, uppercase, `clamp(2.25rem, 6.2vw, 4.5rem)`, line-height 0.94, tracking -0.005em, balanced wrap): floor titles, capped at 20ch. Page titles outside the home run slightly larger (`clamp(2.5rem, 8vw, 5rem)` on the catalogue, `clamp(2.25rem, 7vw, 4rem)` on legal pages).
- **Headline** (same lettering voice, 1.875rem rising to 2.25rem at md): block headings inside a floor. Steps up to 2.25rem/3rem for an emphasised block and 3rem/3.75rem for a product name or a metric value. Numerals in this voice use tabular figures.
- **Title** (700, 100% width, 1.125rem, sentence case): list group headings and row titles. Interactive row titles drop to 600.
- **Lead** (400, 1.125rem, line-height 1.625, Muted): the paragraph under a floor title, capped at 62ch.
- **Body** (400, 1rem, line-height 1.5; 1.375 inside lists): running copy and list items. Small print is 0.875rem in Muted.
- **Label** (600, 78% width, 0.75rem, uppercase, tracking 0.08em, line-height 1.2): the caption of a plate, a directory or a data cell, and footer column headings.
- **Button** (700, 78% width, 0.95rem, uppercase, tracking 0.05em): the text of the call and ghost buttons.

### Named Rules
**The One Family Rule.** There is no second typeface. Contrast comes from the width axis: 66 for lettering, 75 to 78 for labels, buttons and ring numerals, 100 for reading.

**The Lettering Rule.** The condensed heavy voice is always uppercase and always tight (0.94). It is for names, titles and numbers: never a sentence of running copy, never lowercase.

**The Caption Rule.** Label type names the object it sits on or the value beneath it (a plate, a list, a contact cell). It is never set as a line above a title; a floor's title is introduced by its floor plate.

## Layout

One container, 90rem wide, with gutters of 1rem, 1.5rem from sm and 2.5rem from lg. Every floor is a full-bleed band with the container inside it, padded 5rem top and bottom and 7rem from md. Inside a floor the title block comes first, then content blocks at 3.5rem intervals, with 4rem before a closing group.

Floors compose on asymmetric two-column grids from lg (1.1/0.9, 0.9/1.1, 0.8/1.2) and stack below it. Column gaps run 2.5rem to 4rem. Lists are ruled stacks: a top rule, then each row closed by a bottom rule, no gaps and no backgrounds. On a red floor a cell grid is drawn with 1px gaps over a 25% white ground rather than borders.

Breakpoints are Tailwind's defaults. The structural switch is at lg (64rem): two-column floors, hover-driven detail panels that stay sticky at 6rem from the top, and the three-part lobby. The navigation holds its inline floor links until xl (80rem); below that the directory opens full-screen. On small screens horizontal sets (process steps, the product shelf) become snap-scrolling strips that bleed to the screen edge, and detail opens in place under its row.

The top bar is fixed and 4rem tall; anchor targets clear it with a 4.5rem scroll padding. Touch targets are at least 2.75rem, primary controls 3.25rem, and the bar and bottom-anchored controls respect the safe-area insets.

## Elevation & Depth

Flat by default. Depth on a neutral floor is tonal: Ground, Surface and Raised, separated by hairlines. A plate at rest has a frame and no shadow.

Shadow appears only under an object that stands off its floor, and it is always one long, soft, downward shadow pulled in with a negative spread so no edge shows at the sides.

### Shadow Vocabulary
- **Plate on red** (`0 24px 48px -24px rgb(0 0 0 / 0.6)`): a neutral plate mounted on a red floor.
- **Panel on red** (`0 30px 60px -30px rgb(0 0 0 / 0.7)`): the recessed form panel on the red floor.
- **Standing object** (`0 30px 60px -30px rgb(0 0 0 / 0.55)`, or `-36px` spread at 0.5 for a wide panel): the device and window mock-ups.
- **Floating control** (`0 12px 28px -10px rgb(0 0 0 / 0.6)`): the fixed contact button.
- **Call-button glow** (`0 1px 0 rgb(255 255 255 / 0.18) inset, 0 10px 24px -12px rgb(129 3 3 / 0.7)`): a top highlight and a red underglow; the button is lit, not lifted.
- **Lamp halo** (`0 0 0 3px` of LED Red at 22%; 4px on a list dot): the glow around a lit ring or dot.
- **Outline ring** (`0 0 0 1px` Line, `0 0 0 2px` Accent when selected): a frame drawn as a shadow so a tile does not shift size when selected.

### Named Rules
**The Mounted, Not Floating Rule.** Nothing on a neutral floor casts a shadow unless it is a depicted object or a fixed control. Hierarchy between plates is a matter of tone and rule, not lift.

## Shapes

Square. Plates, panels, images, tags, bars and the floor plate have no radius. Borders are 1px hairlines in Line (1.5px on a ring).

Three exceptions, each tied to a physical referent: pressable controls and the readout housing take a 3px ease (buttons, fields, icon buttons, status pills); lamps, rings, dots and round check marks are fully round (999px); and a depicted phone keeps its own bezel radius. Images are cropped hard to the lattice at fixed ratios (4/5, 4/3, 16/9, 3/4 for bottles) with no rounding, frame or overlay.

## Components

### Buttons
Lit, heavy and pressable; they read as lift controls rather than web buttons.
- **Shape:** 3px radius, 3.25rem minimum height, condensed uppercase button type.
- **Call button (primary):** Cabin Red fill, white text, padding 0.75rem 1.4rem. A 0.7rem LED Red lamp with a 2px white ring sits before the label, and the call-button glow sits beneath. One per view is the norm; in the top bar it is shortened to 2.75rem.
- **Ghost:** transparent, 1px Line border, Ink text, padding 0.75rem 1.2rem. Carries an 18px line icon when it is a phone number or a forward link.
- **On-brand:** on a red floor the primary becomes a white fill with Cabin Red text, 3.5rem tall, and the secondary a 45% white outline that goes solid white on hover.
- **Hover / Focus / Active:** hover (pointer devices only) deepens the call button to Cabin Red Deep and darkens the ghost border to Ink; active scales to 0.97; transitions run 160ms on the expo ease. Focus is a 2px Accent outline offset 3px, global to every focusable element.

### Chips
- **Tag:** square, 1px Line outline, 0.875rem semibold, padding 0.25rem 0.625rem. Used for a short set of fixed values.
- **Status pill:** 3px radius, Line outline, 0.75rem semibold, led by a 0.5rem status dot. The four status dot colours belong to the work-order demonstration and are not system colours.

### Cards / Containers
- **Plate:** Raised fill inside a 1px Line frame, square, no shadow on a neutral floor. Padding 1.5rem, 2rem from sm. Content inside is ruled rows, with a Label caption at the top and optionally at the foot.
- **Floor plate:** a square 3.5rem plate (4.5rem from md) holding the floor code in Accent lettering, set to the left of the floor title. On a red floor it is an unfilled 50% white outline with a white code.
- **Red block:** a Cabin Red band inside a neutral floor, image flush to one edge with no gutter, text in On Brand.

### Inputs / Fields
- **Style:** built for a red ground. 22% black fill, 1px 28% white border, white text at 1rem, 3px radius, 3.25rem minimum height, padding 0.8rem 0.9rem. Placeholder at 60% white. Selects use a custom white chevron.
- **Label:** 0.875rem semibold above the field, with "Opcional" at normal weight in On Brand Muted on the right.
- **Focus:** border goes solid white and the fill deepens to 34% black; the caret is Accent.
- **Error:** border #ffd0c9, fill 40% black, and a 0.875rem message beneath in #ffd9d3, linked with `aria-describedby`. No neutral-ground field exists yet.

### Navigation
- **Top bar:** fixed, 4rem tall, transparent over the lobby and solid Ground with a bottom hairline once the page has moved or another floor is current. Left to right: logo (red mark in light, white in dark), readout, floor links, theme toggle, call button.
- **Floor link:** a call ring with the floor code, then the floor name at 0.875rem medium in Muted; Ink on hover and when current. The current floor's ring is lit.
- **Directory (below xl):** a full-screen Ground panel that wipes down from the top edge in 420ms. Ruled rows 4rem tall with a 2.25rem ring and the floor name in 1.5rem lettering, listed top floor first, followed by the call and ghost buttons.
- **Footer:** Ground with a top hairline; four columns from md under Label headings; links in Muted turning Ink, each floor link led by its code in Accent.

### Call Ring
The ring of a lift call button: 1.75rem circle, 1.5px Steel outline, numeral at 0.8rem bold and 75% width. Lit when its floor or step is current: outline and numeral turn LED Red with a 3px halo, over 200ms. Used for floor links and for numbered steps. The lit numeral measures 5.5:1 on the dark ground and 3.0:1 on the light one.

### Floor Readout
A 2.5rem Display Glass housing with a 3px radius and a 10% white inner ring. It holds a direction arrow that flips with scroll direction, one seven-segment digit drawn in LED Red (unlit segments stay at 10% so the digit reads as hardware; segments switch in 140ms, linear), and the floor name in Label type at 75% white from sm up. It announces itself as a status region. Pages outside the home set their own code (A for the catalogue, a dash for legal pages).

### Ruled Selector
A ruled list that drives a single detail view. Each row has a lamp dot (Line when idle, LED Red with a halo when active), a 1.125rem semibold title that moves from Muted to Ink, and a 0.875rem line beneath. From lg, hover selects and the detail stays sticky beside the list; below lg the row expands in place over 400ms with a plus that rotates to a cross.

### Door Image
An image frame that changes its picture the way the lift opens: the incoming image is revealed by a clip that parts from the vertical centre line over 550ms on the expo ease. With reduced motion it cross-fades.

### Data Bar
A 2.5rem-tall Cabin Red bar on a shared linear scale, growing from the left over 900ms with an 80ms stagger per row when it enters view. The value sits to the right in lettering with its unit beneath in small Muted text.

### Icons
Line icons at 14 to 24px, drawn in the current text colour or in Accent, always inline beside text or centred in an icon button. None sits in its own tile or badge.

## Do's and Don'ts

### Do:
- **Do** give every floor one code and show it identically in the nav ring, the readout, the floor plate and the footer directory.
- **Do** keep plates, panels, images and tags square, with 1px Line frames; reserve the 3px radius for pressable controls and the readout, and full rounds for lamps, rings and dots.
- **Do** alternate neutral floors between Ground and Surface, and rule a Surface floor top and bottom.
- **Do** build lists as ruled rows (a top rule, then a bottom rule per row) rather than as separate boxes.
- **Do** set titles, names and numbers in the 66% width, weight 800, uppercase lettering voice at line-height 0.94, and keep floor titles within 20ch.
- **Do** use Accent for red text on neutral grounds and On Brand or On Brand Muted for text on red.
- **Do** keep touch targets at 2.75rem or more and primary controls at 3.25rem.
- **Do** reveal swapped content from a centre seam or with a short settle on `cubic-bezier(0.16, 1, 0.3, 1)`, and give every animated change a reduced-motion fallback.
- **Do** state a selected or current item with light (LED Red lamp, ring or dot) plus a change from Muted to Ink.

### Don't:
- **Don't** introduce a second typeface; change the width axis instead.
- **Don't** set running copy in the lettering voice, or set the lettering voice in lowercase.
- **Don't** place Label type as a line above a title; it captions plates, lists and values.
- **Don't** use red as a tint, gradient, border accent or wash; it is a full surface or a lamp.
- **Don't** set Cabin Red as text on a dark ground, or Steel or Line as text anywhere new.
- **Don't** use LED Red for a surface or a paragraph; it is for lamps, rings, dots and the readout.
- **Don't** put a shadow under a plate on a neutral floor, and don't use short, hard or offset shadows anywhere.
- **Don't** round plates or images, or frame icons in tiles.
- **Don't** change a colour's role between themes; change its value.
