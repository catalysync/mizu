/**
 * Blocking inline script that runs before React hydrates. Reads the stored
 * color scheme from localStorage (or falls back to prefers-color-scheme) and
 * sets the data-theme attribute synchronously so the page renders with the
 * correct theme on first paint.
 */
export function ThemeScript() {
  const js = `
(function(){
  try {
    var k='tweakmizu-theme';
    var s=localStorage.getItem(k);
    if(s!=='light'&&s!=='dark'){
      s=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
    }
    if(s==='dark') document.documentElement.setAttribute('data-theme','dark');
  } catch(e){}
})();
`.trim();
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
