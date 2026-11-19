/**
 * Runs in <head> before paint so the theme never flashes.
 * Light by default; dark only if the visitor picked it with the toggle.
 * Plain module: the server layout imports it.
 */
export const themeScript = `try{document.documentElement.dataset.theme=localStorage.getItem('theme')==='dark'?'dark':'light'}catch(e){document.documentElement.dataset.theme='light'}`;
