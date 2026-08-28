const input = document.getElementById("urlInput");
const button = document.getElementById("goButton");

window.__scramjet$config = {
    prefix: '/service/',
    codec: 'xor',
    files: {
        wasm: 'https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@latest/dist/scramjet.wasm.js',
        worker: 'https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@latest/dist/scramjet.worker.js',
        client: 'https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@latest/dist/scramjet.client.js',
        bundle: 'https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@latest/dist/scramjet.bundle.js',
        config: 'https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@latest/dist/scramjet.config.js',
    }
};

window.addEventListener('load', async () => {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@latest/dist/scramjet.sw.js', {
                scope: __scramjet$config.prefix
            });
        } catch (err) {
            console.error("Service Worker registration failed:", err);
        }
    }
});

async function go() {
    const query = input.value.trim();
    if (!query) {
        input.focus();
        return;
    }

    let targetUrl;
    try {
        if (query.includes(".") && !query.includes(" ")) {
            targetUrl = query.startsWith("http") ? query : `https://${query}`;
        } else {
            targetUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
        }
    } catch (e) {
        targetUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
    }

    const encodedUrl = __scramjet$config.prefix + __scramjet.encodeUrl(targetUrl);
    window.location.href = encodedUrl;
}

button.addEventListener("click", go);
input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        go();
    }
});