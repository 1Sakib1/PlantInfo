const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
const searchSectionStart = '    // Autocomplete fetcher';
const searchSectionEnd = '    }, [query]);';
const startIndex = code.indexOf(searchSectionStart);
if (startIndex !== -1) {
    const endIndex = code.indexOf(searchSectionEnd, startIndex) + searchSectionEnd.length;
    const replacement =     // Autocomplete fetcher
    useEffect(() => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      const timer = setTimeout(async () => {
        try {
          const res = await fetch('/api/autocomplete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
          });
          const data = await res.json();
          setSuggestions(data.suggestions || []);
        } catch (e) {
          console.error("Autocomplete error", e);
        }
      }, 300);
      return () => clearTimeout(timer);
    }, [query]);;
    const newCode = code.slice(0, startIndex) + replacement + code.slice(endIndex);
    fs.writeFileSync('src/App.jsx', newCode);
    console.log('App.jsx Autocomplete updated successfully');
}
