---
name: Tic Tac Toe
description: Burgundy elegance, ivory surfaces and precise game geometry.
colors:
  bg: "#f8f6f7"
  surface: "#fffafb"
  muted-surface: "#efe4e8"
  text: "#35242d"
  muted: "#705963"
  line: "#ddcbd3"
  control-border: "#957483"
  accent: "#74293f"
  on-accent: "#fff8fb"
  action: "#74293f"
  action-hover: "#5f2035"
  on-action: "#fff8fb"
  club: "#3e1c2b"
  on-club: "#fff4f8"
  club-muted: "#dfbecb"
  club-edge: "#956b7c"
  x: "#842b4a"
  o: "#605d74"
  error: "#ae263f"
  on-error: "#fff"
  success: "#6d4f82"
  dark-bg: "#181317"
  dark-surface: "#281d24"
  dark-muted-surface: "#382630"
  dark-text: "#faedf2"
  dark-muted: "#cdb3bf"
  dark-line: "#59404d"
  dark-control-border: "#ac869a"
  dark-accent: "#dfb1c2"
  dark-on-accent: "#371724"
  dark-action: "#dfb1c2"
  dark-action-hover: "#efcbd8"
  dark-on-action: "#371724"
  dark-club: "#351d29"
  dark-x: "#e5afc5"
  dark-o: "#c3bcd6"
  dark-error: "#ffa5b4"
  dark-on-error: "#3c1620"
  dark-success: "#d8bde7"
typography:
  display:
    fontFamily: '"Instrument Serif", "Readex Pro", serif'
    fontSize: "clamp(4rem, 7.5vw, 6rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: '"Instrument Serif", "Readex Pro", serif'
    fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: '"Readex Pro", "Noto Sans Arabic", system-ui, sans-serif'
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.025em"
  body:
    fontFamily: '"Readex Pro", "Noto Sans Arabic", system-ui, sans-serif'
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: '"Readex Pro", "Noto Sans Arabic", system-ui, sans-serif'
    fontSize: "0.8125rem"
    fontWeight: 500
rounded:
  control: "0.375rem"
  panel: "0.5rem"
  brand: "5px"
  badge: "2rem"
spacing:
  compact: "0.5rem"
  small: "0.75rem"
  base: "1rem"
  medium: "1.25rem"
  section: "1.5rem"
  panel: "2rem"
  large: "2.5rem"
  wide: "3rem"
  open: "4rem"
components:
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "{colors.on-action}"
    rounded: "{rounded.control}"
    padding: "0.7rem 1.25rem"
  button-primary-hover:
    backgroundColor: "{colors.action-hover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "0.7rem 1.25rem"
  button-danger:
    backgroundColor: "{colors.error}"
    textColor: "{colors.on-error}"
    rounded: "{rounded.control}"
    padding: "0.7rem 1.25rem"
  text-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "0.75rem 0.875rem"
  navigation:
    textColor: "{colors.muted}"
    padding: "0.65rem 0.9rem"
    rounded: "0"
  badge:
    backgroundColor: "{colors.muted-surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.badge}"
    padding: "0.25rem 0.65rem"
  club-panel:
    backgroundColor: "{colors.club}"
    textColor: "{colors.on-club}"
    rounded: "{rounded.panel}"
    padding: "2rem"
  decorative-board:
    backgroundColor: "{colors.club}"
    rounded: "{rounded.panel}"
    padding: "3.5rem"
  game-cell:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "0"
  alert:
    backgroundColor: "{colors.muted-surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "1rem 1.125rem"
---

# Design System: Tic Tac Toe

## Overview

**Creative North Star: "Burgundy Elegance"**

Deep burgundy, rose ivory and near-black wine give the interface a composed, elegant character. Instrument Serif adds contrast to Latin display headings; Readex Pro keeps controls, body text and Arabic clear. Fine grid lines, upright geometry and restrained corners carry the identity through the lobby, live game, account forms, administration and legal pages.

The board remains the focal interaction. Supporting screens use quieter type and shared controls; decoration is limited to an authored monochrome game board and small SVG icons. Motion follows confirmed state changes, finishes promptly and respects reduced motion.

**Key Characteristics:**

- Burgundy actions and accents with ivory light surfaces and wine-dark surfaces.
- Local serif display type with a clear sans-serif body and Arabic fallback.
- Upright game geometry, fine strokes and restrained corners.
- Flat everyday surfaces with deliberate modal depth.
- Stable controls, explicit feedback and bounded state motion.

Source capture: `src/frontend/styles/index.css` and current frontend components, 2026-10-30. This records the owner's burgundy revision; earlier visual direction is superseded. Frontmatter holds shared values; `dark-` entries record theme overrides. Browser and visual results belong to delivery evidence.

## Colors

Burgundy and muted rose provide the accent range; ivory and wine-black establish the two themes. Sidecar tonal ramps are generated preview metadata, not additional runtime swatches.

### Primary

- **Burgundy / Rose Action** (`action`, `action-hover`, `on-action`): primary buttons and text selection, with a darker burgundy hover in light mode and a lighter rose hover in dark mode.
- **Burgundy / Rose Accent** (`accent`, `on-accent`): links, focus, current navigation and the brand tile; the brand foreground uses its paired accent foreground.
- **Deep Wine** (`club`, `on-club`, `club-muted`, `club-edge`): the computer-play panel, authentication aside and decorative board, with pale marks and subdued grid lines.

### Secondary

- **Burgundy X** (`x`): live X marks and player symbols; dark mode uses a pale rose.
- **Slate Violet O** (`o`): live O marks and player symbols; dark mode uses a pale violet. Decorative marks instead use the monochrome wine-panel foregrounds.

### Tertiary

- **Error Rose** (`error`, `on-error`): invalid fields, error feedback and destructive actions.
- **Success Violet** (`success`): successful feedback text and border.

### Neutral

- **Rose Ivory / Wine Ground** (`bg`): page canvas.
- **Ivory / Wine Surface** (`surface`): controls, board cells, table and dialog.
- **Muted Rose Surface** (`muted-surface`): quiet grouped states, hover backgrounds and badges.
- **Wine Ink / Pale Rose Ink** (`text`): primary text; **Quiet Rose Ink** (`muted`) carries supporting text.
- **Rose Divider** (`line`): section and table boundaries; **Control Edge** (`control-border`) gives fields and cells a stronger boundary.

**The Shape Before Color Rule.** Keep X/O geometry, text labels and active-state cues alongside color; color alone must never carry the game state.

## Typography

**Display Font:** local Instrument Serif Regular, followed by local Readex Pro and serif fallbacks. It supplies Latin page headings, the brand, play-option headings, the authentication aside heading, player symbols and live status. Instrument Serif does not contain Arabic glyphs; those fall back to Readex Pro.

**Body Font:** local Readex Pro, followed by Noto Sans Arabic, system-ui and sans-serif fallbacks. Readex Pro covers Latin and Arabic and has a declared variable weight range (160–700). Both fonts use `font-display: swap`; both are distributed with their SIL Open Font Licenses and attribution in `public/fonts/`. No external runtime font requests are used.

### Hierarchy

- **Display:** the guest heading uses the frontmatter display scale; member introductions use a smaller fluid scale (`clamp(2.75rem, 5vw, 4rem)`). At 760px it reduces to a compact fluid scale; at 520px the guest heading is fixed (3.75rem).
- **Headline:** page headings use the frontmatter headline scale. Authentication uses a quieter range (`clamp(2.25rem, 4vw, 3rem)`); live status uses a centered range (`clamp(2.25rem, 4.5vw, 3rem)`).
- **Title:** ordinary section headings use the sans-serif title role; play-option headings use regular display type (2.5rem, reduced to 1.75rem at 520px). Subheadings remain sans-serif (1.125rem, weight 600, line-height 1.4).
- **Body:** paragraphs stop at 70ch; legal articles cap at 72ch and use more open paragraph leading (1.9).
- **Label:** field labels use the label role. Buttons use regular body type (0.875rem, weight 400, line-height 1.5). Badges and footer text are smaller (0.75rem). Tables and pagination use tabular numerals.

**The Script Fallback Rule.** Preserve the local Arabic fallback, translated labels and natural wrapping wherever Latin display type is used.

## Layout

The centered shell caps its width (1240px) with inline padding (3rem). At 1100px padding reduces (2rem), navigation wraps to a full row and the header keeps preferences together. At 520px padding reduces again (1.25rem) and preferences take their own row. Navigation links can wrap for narrow translated layouts.

Guest entry pairs the introduction with upright board artwork. Member entry compacts that artwork and places computer and friend choices below. The live stage is centered (42rem maximum), with a square zero-gap board (`min(100%, 30rem)`) so winning-line geometry aligns with grid thirds. Tables scroll within their bordered region.

At 760px, play choices and account columns stack; authentication becomes one column and hides its decorative aside. At 520px, the guest introduction and mode summaries stack, member artwork hides and recent-game actions wrap. The join form aligns its desktop action with the input, below the label, then stacks the whole field above the action on phones. Forms cap at 38rem; spacing expands from compact control gaps to open section separation.

**The Logical Flow Rule.** Use logical spacing and isolated player names for RTL; keep the physical board and invitation codes LTR so positions remain consistent across languages.

## Elevation & Depth

Everyday surfaces are flat. Fine borders, rose tonal changes and spacing establish hierarchy. The active player combines an accent border, Surface background and thin inset underline (`inset 0 -1px 0 var(--accent)`). A playable cell gains an inset hover boundary (`inset 0 0 0 2px var(--accent)`). Only the native dialog floats, using a shadow (`0 24px 100px #170d1440`) over a dim backdrop (`#170d23a6`).

**The Modal Depth Rule.** Reserve floating elevation for modal interruption; use tonal surfaces and borders for normal content.

## Shapes

Controls and ordinary framed regions use the compact control radius. Panels, artwork, dialogs and the board's outer corners share the panel radius. The brand tile has its own smaller corner; badges remain pill-like. Internal board corners are square and cells have zero gap. X/O marks use fine SVG strokes (5 units in a 100-unit viewBox) with butt caps. The interactive winning line is finer (2.5 units in a 300-unit viewBox). Decorative and interactive boards are upright.

## Components

### Buttons

Regular-weight labels and compact corners keep actions restrained. Primary uses the paired Action colors; secondary uses Surface and Control Edge; danger uses Error Rose and its foreground. Shared padding and radius are in frontmatter. Ordinary buttons have a minimum block size (48px); navigation links, preference controls and logout use a compact minimum (44px).

Enabled buttons lift slightly on hover (-1px). Primary hover uses the theme's Action Hover token; secondary hover uses Muted Rose Surface. Press returns to the baseline with a slight scale (0.99). Transitions take 180ms, with the shared ease for movement. Disabled buttons use a waiting cursor and reduced opacity (0.6).

### Chips

Status badges use Muted Rose Surface, compact padding and the badge radius. The accent variant changes text color and adds a current-color dot (6px); readable text remains present.

### Cards / Containers

Computer play uses an enclosed Deep Wine panel; friend play uses an open section with a stronger top boundary. Authentication repeats the wine enclosure as a supporting aside. These are specific compositions rather than a general card grid. Artwork shows an in-progress monochrome board with internal grid lines, transparent cells and no highlighted tile or decorative winning slash.

### Inputs / Fields

Fields use Surface, a thin Control Edge border (1px), the control radius and a minimum block size (48px). Hover strengthens the border with Accent; read-only uses Muted Rose Surface. Invalid fields use an Error Rose border and linked feedback. Stable IDs connect labels, hints and errors. Native select, checkbox and password behavior remains intact.

Interactive controls use a visible Accent outline (3px, offset 4px). Board focus moves inside the cell (offset -5px); the wine computer panel uses its pale foreground for focus. Checkboxes retain their native dimensions and interaction.

### Navigation

The brand pairs serif text with a burgundy/rose X/O tile and its dedicated foreground. Navigation uses muted compact labels with a minimum block size (44px). Hover changes text to Accent; the current page adds an Accent underline and medium weight, without a filled navigation background. Live matches remain under Play. Language is a labelled native select, the icon-only theme control has a translated accessible name, and the skip link becomes visible on focus. Legal links state that they open separately.

### Game Board and State

Nine native buttons expose row, column and current mark. Unavailable cells retain focusability with `aria-disabled` and a guarded move handler. X/O marks occupy a restrained portion of the cell (58%, capped at 110px). New confirmed SVG strokes draw in sequence (320ms, second X stroke delayed 100ms); initial snapshot marks stay complete. A confirmed winning line draws through the three cell centers (550ms, delay 160ms), a new result reveals briefly (450ms), and a dialog arrives once (220ms). Player emphasis transitions over 240ms.

The turn/result heading announces updates politely. Connection feedback and recovery sit beside the board, and playable state follows saved server state. Rematch opens the newly saved game immediately. Reduced motion removes animations and transitions and presents finished strokes. Decorative artwork is hidden from assistive technology and has no input behavior.

**The Confirmed Motion Rule.** Animate committed state without delaying input, retrying uncertain moves, replaying initial marks or replacing focused cell buttons.

## Do's and Don'ts

### Do:

- **Do** reuse the burgundy/rose semantic colors in both themes and preserve body-text contrast (4.5:1).
- **Do** use local Instrument Serif for Latin display roles and retain Readex Pro for body text and Arabic fallback.
- **Do** preserve translated labels, logical layout, LTR board positions, isolated names and visible stable focus.
- **Do** keep state motion brief, finished and compatible with reduced motion and server authority.
- **Do** verify desktop, 360px and narrow 320px reflow, both themes, French and Arabic RTL after interface changes.

### Don't:

- **Don't** introduce green or orange accents or classroom stationery motifs.
- **Don't** add gradients, remote font requests or decorative animation loops.
- **Don't** replace game labels or shape cues with color alone.
- **Don't** add floating shadows to ordinary content or optimistic board state for animation.
- **Don't** delay rematch navigation or infer completed visual verification from this source record.
