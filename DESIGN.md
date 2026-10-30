---
name: Tic Tac Toe
description: A welcoming modern game club in paper, forest and lime.
colors:
  bg: "#f5f4ec"
  surface: "#fffef9"
  muted-surface: "#e9ecdf"
  text: "#203c2e"
  muted: "#56665a"
  line: "#ccd3c4"
  control-border: "#718372"
  accent: "#294f37"
  action: "#d9f477"
  on-action: "#203c2e"
  club: "#234633"
  on-club: "#f8f8ed"
  club-muted: "#c1d1bf"
  x: "#315bca"
  o: "#b54b36"
  error: "#a23330"
  on-error: "#fff"
  success: "#28643b"
  dark-bg: "#14271f"
  dark-surface: "#1c3428"
  dark-muted-surface: "#284335"
  dark-text: "#f3f3e6"
  dark-muted: "#b5c4b4"
  dark-line: "#49604d"
  dark-control-border: "#91a58d"
  dark-accent: "#d9f477"
  dark-club: "#244b35"
  dark-x: "#a3bbff"
  dark-o: "#ffac94"
  dark-error: "#ffafa3"
  dark-on-error: "#351713"
  dark-success: "#b9dd9c"
typography:
  display:
    fontFamily: '"Readex Pro", "Noto Sans Arabic", system-ui, sans-serif'
    fontSize: "clamp(3.75rem, 7.5vw, 6rem)"
    fontWeight: 600
    lineHeight: 1.06
    letterSpacing: "-0.04em"
  headline:
    fontFamily: '"Readex Pro", "Noto Sans Arabic", system-ui, sans-serif'
    fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.035em"
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
  control: "0.75rem"
  panel: "1rem"
  artwork: "1.5rem"
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
    rounded: "0.6rem"
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

**Creative North Star: "The Modern Game Club"**

Warm paper and deep forest framing make the game welcoming; lime makes the next action easy to find. Blue X and coral O give the board its own visual language. Flat color, geometric marks and a locally hosted typeface carry the identity across the lobby, live game, forms, tables and legal pages.

Expressive scale belongs to the introduction and the board. Supporting screens use the same controls with quieter type and clear reading order. Authored SVG supplies the game artwork and icons; motion describes confirmed state changes, then stops. The system uses no gradients, remote fonts or decorative loops.

**Key Characteristics:**

- Warm paper surfaces with forest framing and lime actions.
- One local type family for Latin and Arabic.
- Geometric X/O marks with distinct shape and color.
- Flat everyday surfaces and deliberate modal depth.
- Bounded motion, stable controls and explicit state feedback.

Source capture: `src/frontend/styles/index.css` and the current frontend components, 2026-10-29. Frontmatter records the shared values; `dark-` color entries describe overrides under `data-theme="dark"`. Rendered review and browser results belong to the delivery evidence, not this source capture.

## Colors

The palette combines warm light surfaces and green dark surfaces with a consistent lime action color. The sidecar's tonal ramps are generated preview metadata; they are not new runtime swatches.

### Primary

- **Club Lime** (`action`, `on-action`): primary action fill with dark forest ink in both themes; also the brand tile and text selection.
- **Forest Accent** (`accent`): links, focus outlines and active-player emphasis. Dark mode replaces the forest accent with Club Lime.
- **Club Forest** (`club`, `on-club`, `club-muted`): enclosed game artwork, the computer-play panel and the authentication aside, with light text and subdued supporting copy.

### Secondary

- **Blue X** (`x`): live X marks and player symbols; the dark override lightens the blue.
- **Coral O** (`o`): live O marks and player symbols; the dark override lightens the coral. The decorative board retains the light board's blue and coral on its pale tiles.

### Tertiary

- **Error Red** (`error`, `on-error`): field errors, error feedback and destructive actions, with theme-specific foregrounds.
- **Success Green** (`success`): successful feedback text and border.

### Neutral

- **Paper / Forest Ground** (`bg`): page canvas.
- **Warm Surface / Forest Surface** (`surface`): controls, board cells, table and dialog.
- **Soft Green Surface** (`muted-surface`): quiet grouped states, hover backgrounds, badges and inactive players.
- **Forest Ink / Pale Ink** (`text`): primary text; **Quiet Ink** (`muted`) carries supporting text.
- **Soft Divider** (`line`): page sections and table rows; **Control Edge** (`control-border`) gives fields and board cells a stronger boundary.

**The Shape Before Color Rule.** Keep X/O geometry, text labels and active-state cues alongside color; color alone must never carry the game state.

## Typography

**Display and Body Font:** Readex Pro, with Noto Sans Arabic, system-ui and sans-serif fallbacks. The variable font is self-hosted at `public/fonts/readex-pro.ttf`, covers Latin and Arabic, and uses `font-display: swap` with a declared weight range (160–700). The font asset is 278,544 bytes; the SIL Open Font License and attribution are beside it. The fallback family name does not trigger a remote request.

**Character:** Rounded geometric letterforms connect the interface to the board. One family keeps short controls and longer translated text related without introducing a second decorative voice.

### Hierarchy

- **Display:** the guest lobby heading uses the frontmatter display scale; member introductions use a smaller fluid scale (`clamp(2.75rem, 5vw, 4rem)`). Responsive overrides below narrow the guest scale and remove its short line measure.
- **Headline:** page headings use the frontmatter headline scale; authentication headings are quieter (`clamp(2.25rem, 4vw, 3rem)`). Live status has a centered fluid scale (`clamp(1.75rem, 4vw, 2.5rem)`).
- **Title:** section headings use the title role. Subheadings use a smaller semibold scale (1.125rem, line-height 1.4).
- **Body:** the body role sets the default. Paragraphs stop at a readable measure (70ch); legal articles cap at 72ch with more generous paragraph leading (1.9).
- **Label:** field labels use the label role. Buttons use medium type (0.875rem, line-height 1.5); badges and footer text are smaller (0.75rem). Tables and pagination use tabular numerals.

**The Shared Script Rule.** Use the same local family for English, French and Arabic; preserve translated labels and natural wrapping rather than forcing uppercase interface copy.

## Layout

The centered shell caps its width (1240px) with generous inline padding (3rem). At the first breakpoint (1100px), padding reduces (2rem), navigation wraps to a full row and the header keeps preferences together. At the compact breakpoint (520px), padding reduces again (1.25rem) and preferences take their own row. Navigation links wrap within their row to accommodate narrow translated layouts.

Guest entry pairs an introduction with a square geometric board illustration; signed-in entry makes that artwork compact and gives the two play choices their own area. The live game has a centered stage (42rem maximum) and a large square board (`min(100%, 30rem)`). Board cells have zero gap so win-line geometry stays aligned with exact grid thirds. Tables scroll within their own bordered region.

At the intermediate breakpoint (760px), play choices and account columns stack; authentication becomes one column and hides its decorative aside. At the compact breakpoint (520px), the guest introduction and game-mode summaries stack, the member artwork hides and recent-game actions wrap. Shared spacing progresses from compact control gaps to open section separation; forms cap their width (38rem).

**The Logical Flow Rule.** Use logical spacing and isolated player names for RTL; keep the physical game board and invitation codes LTR so positions remain consistent across languages.

## Elevation & Depth

Everyday surfaces are flat. Borders, green tonal changes and spacing establish hierarchy; panels have no ambient shadows. The active player gets an inset underline (`inset 0 -3px 0 var(--accent)`), and a playable cell gains an inset hover boundary (`inset 0 0 0 2px var(--accent)`). A native dialog alone uses a floating shadow (`0 24px 100px #071b2340`) over a dim backdrop (`#071b23a6`).

**The Modal Depth Rule.** Reserve floating elevation for modal interruption; use tonal surfaces and borders for normal content.

## Shapes

Controls and ordinary framed regions share gently rounded corners through the control radius. Larger enclosed panels use the panel radius; prominent artwork and authentication framing use the artwork radius. Badges are pill-like. The playable board has a rounded outer silhouette (1rem), square internal corners, and outlined zero-gap cells. Marks have round stroke ends. The decorative board is tilted slightly (-7deg); the interactive board remains upright.

## Components

### Buttons

Clear, compact actions with a light tactile response. The primary variant uses Club Lime and forest ink with a dark border; secondary uses Surface and Control Edge; danger uses Error Red and its foreground. Shared padding and the control radius are in frontmatter. Ordinary buttons have a minimum block size (48px); header preference and logout buttons use a compact minimum (44px).

Hover lifts enabled buttons slightly (-2px); primary hover uses a stronger lime (`#c6e65e`) and secondary hover uses Soft Green Surface. Press returns the button to its base position and scales it slightly (0.98). Transitions take 180ms with the shared ease for movement. Disabled native buttons use a waiting cursor and reduced opacity (0.6).

### Chips

Status badges use Soft Green Surface, compact padding and the badge radius. The accent variant changes its text color and adds a small current-color dot (6px); readable text remains present.

### Cards / Containers

The computer-play panel is an enclosed Club Forest block with light copy; friend play uses an open section with a strong top border. Authentication repeats the forest enclosure as a supporting aside. These are specific compositions, not a general-purpose card grid. Shared alerts, fields, tables and dialogs retain their own semantic structure.

The room-code form aligns its submit action with the input on desktop, leaving
the hint beneath the input. At compact widths (520px and below), the complete
label/input/hint field precedes the action in one column.

### Inputs / Fields

Fields use Surface, a thin Control Edge border (1px), the control radius and a minimum block size (48px). Hover strengthens the border with Accent. The read-only state uses Soft Green Surface. Invalid text fields use an Error Red border and linked field feedback. Labels, hints and errors remain connected through stable IDs; native select, checkbox and password behavior are preserved.

All interactive controls use a visible Accent outline (3px, offset 4px). The board moves this outline inside each cell (offset -5px); focus on the forest computer panel uses Club Lime. Checkbox controls retain their native interaction rather than adopting the full text-field dimensions.

### Navigation

A lime X/O brand tile anchors the header. Navigation uses compact muted labels with a minimum block size (44px); hover and current page use Soft Green Surface and primary text, with the current page also medium-weight. Active-page semantics include live matches under Play. Language remains a labelled native select, and the icon-only theme button has a translated accessible name. The skip link becomes visible on focus. Legal links state that they open separately so active forms remain intact.

### Game Board and State

Nine native cell buttons expose row, column and current mark. Unavailable cells retain focusability with `aria-disabled` and a guarded move handler. New confirmed marks draw through authored SVG; marks already in the initial snapshot stay complete. X strokes draw in sequence (320ms with the second stroke delayed 100ms). A confirmed winning line draws through the three cell centers (550ms with a 160ms delay). A new result receives a short reveal (450ms), while a dialog arrives once (220ms). Active-player emphasis transitions over 240ms.

The turn/result heading announces updates politely. Connection feedback and recovery sit beside the board; playable state follows saved server state. Rematch opens the newly saved game immediately. Reduced-motion settings remove animation and transitions and show finished strokes. Decorative artwork is hidden from assistive technology and has no input behavior.

**The Confirmed Motion Rule.** Animate committed state without delaying input, retrying uncertain moves, replaying initial marks or replacing focused cell buttons.

## Do's and Don'ts

### Do:

- **Do** reuse shared semantic colors in both themes, keep lime actions legible with forest ink and preserve the body-text contrast requirement (4.5:1).
- **Do** preserve translated labels, logical layout, LTR board positions and isolated player names.
- **Do** retain native controls, visible focus, stable board buttons and explicit connection recovery.
- **Do** use short SVG/CSS state motion that finishes and respects reduced motion.
- **Do** verify rendered desktop, 360px and narrow 320px reflow, both themes, French and Arabic RTL when changing the interface.

### Don't:

- **Don't** add gradients, remote font requests or decorative animation loops.
- **Don't** replace game labels or shape cues with color alone.
- **Don't** place ordinary content on floating shadows or turn every section into an enclosed card.
- **Don't** delay rematch navigation or invent optimistic board state for an animation.
- **Don't** infer completed visual or accessibility verification from this source-based design record.
