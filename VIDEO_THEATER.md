# Headquarters Video Theater

Implemented on `feature/headquarters-video-theater` for review; do not merge or publish without owner approval.

- Entry points: prominent yellow Home welcome button, dashboard card, desktop navigation, mobile section picker.
- Four selectable rooms, favorite-room filtering, optional missions, persistent device-local completion, four badges in the existing cabinet/profile/rewards/XP system. Completion is idempotent; no reward for merely opening a video.
- Native controlled playback with no autoplay, pause on leaving the theater or hiding the tab, keyboard controls, visible focus, live announcements, responsive layout. Accessibility settings link to the existing Profile controls for text size, contrast and motion.
- Theater progress and favorites are local to this browser/device, not cloud-synced.

## Media and artwork still needed

The requested `/mnt/data/ChatGPT Image Nov 2, 2026, 08_27_21 PM(1).png`, approved theater design, and `/mnt/data/headquarters rainbow bubble(1).mp4` were not available in the supplied workspace or retrieved chat attachments. No replacement heroes were generated. The theater retains the repository's existing seven-character badge artwork pending the exact approved reference.

The existing `media/spectrum-super-hero-intro.mp4` is available in the welcome player (local metadata loaded: 5.04 seconds). This is not verified as the previously supplied headquarters video. Four room videos remain explicitly “coming soon”; no unverified external video URLs or fake play buttons are used. The existing intro does not have captions; the UI discloses this. Supply approved room videos, captions/transcripts, headquarters clip and reference/design before final media sign-off.

## Validation

- `node --check` passed for theater.js, service-worker.js, and every inline index.html script.
- `git diff --check` passed.
- Browser: all four room controls; favorites filter; favorite and mission persistence after reload; duplicate completion disabled; Adventure Hero shown unlocked in existing Badge Cabinet.
- Existing welcome file loaded metadata successfully without autoplay.
- Desktop and 390px phone layout inspected; phone document width 375px within 390px viewport, no horizontal document overflow.
- Existing Home and Badge Cabinet navigation and cloud topic/resource loading remained functional.

## Maintainer notes

New UI is scoped to theater.css/theater.js. The existing show() extension pattern is preserved. Badge definitions are added to both existing badge registries. Service-worker shell version is bumped and new static files are cached; large videos are not added to the precache.

## Music & Dance update

Three user-supplied YouTube videos are now configured: original (`Rb1lljqbJdA`), sing-along with lyrics (`6iHHPwYN7Zg`), and instrumental with lyrics (`tHgUhYfgUIw`). Each has a responsive privacy-enhanced embed and direct YouTube fallback. Playback never autostarts; leaving the theater, switching videos/rooms, or hiding the tab unloads the embed. The other three rooms still say coming soon. Captions on YouTube depend on each upload's settings; visible lyrics are part of the two lyric videos.

Validation of the music update: all three YouTube embed titles loaded in the browser; video selection updates the player and direct link; switching to Calm Corner removes the iframe. Phone viewport 390px: page width 375px, player width 323px. No autoplay URL parameter is enabled. JavaScript syntax and whitespace checks pass.
