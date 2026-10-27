# Taskboard design system

The product is an everyday public task list. Its design prioritizes finding work,
understanding who may change it, and receiving clear feedback. No visual authority
existed beyond a scaffold. The authorized direction is restrained Operate mode,
code-led, without remote fonts or decorative assets.

Use one system sans family; fixed 1rem body, 1.25rem section titles and 2rem page
titles. Spacious page gutters enclose compact repeated task rows. Neutral warm
white/charcoal surfaces and one blue accent carry action and selection. Borders
separate data; avoid decorative cards. Error red and success green convey state
with text. Light is the default; dark uses the same semantic tokens and geometry.

The layout is a top navigation bar, page heading with primary action, scoped
filter area, then a list of task records. The signature is a precise aligned
status/priority/owner metadata line beneath plain task text. At narrow widths,
filters stack, navigation wraps, and actions retain large touch targets. All
spacing and alignment are logical for Arabic. User text is isolated with bdi.

Controls use native semantics with a consistent 44px minimum interactive height.
Focus is a visible blue outline. Task editing is inline; only destructive actions
use a native modal dialog with focus return. Feedback remains adjacent to its
form. Loading, disabled, success, conflict recovery, empty and error states share
translated labels. Motion only follows state, and reduced-motion disables it.

The 12 primitives are Button, TextField, SelectField, CheckboxField, FormField,
Alert, Badge, Dialog, DataTable, Pagination, Tabs and EmptyState. Keep primitives
small and compose actual workflows. No marketing, illustration, novelty controls,
extra modules, fabricated usage or private data in public render paths.
