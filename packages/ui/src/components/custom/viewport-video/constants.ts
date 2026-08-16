// Require meaningful visibility before fetching video metadata or starting playback.
// This avoids loading media when a section only clips into the viewport by a few pixels.
export const DEFAULT_VIEWPORT_VIDEO_ROOT_MARGIN = '0px 0px -25% 0px'
