// Keeps <html data-theme> in step with the OS light/dark preference.
// tokens.css defines every colour per theme, so flipping this one attribute re-themes the app.
const query = '(prefers-color-scheme: dark)'

export function themeFor(prefersDark) {
  return prefersDark ? 'canopy' : 'daylight'
}

export function syncTheme(root = document.documentElement, media = window.matchMedia(query)) {
  const apply = () => { root.dataset.theme = themeFor(media.matches) }
  apply()
  media.addEventListener('change', apply)
  return () => media.removeEventListener('change', apply)
}
