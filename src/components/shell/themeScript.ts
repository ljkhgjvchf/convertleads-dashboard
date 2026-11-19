/** Runs in <head> before paint so the saved theme never flashes. Plain module: the server layout imports it. */
export const themeScript = `try{var t=localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t}catch(e){}`;
