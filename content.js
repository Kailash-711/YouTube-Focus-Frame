chrome.storage.local.get('suggestionsDisabled', function(data) {
    const isDisabled = data.suggestionsDisabled || false;

    if (isDisabled) {
        applyStyles();
    } else {
        removeStyles();
    }
});

function applyStyles() {
    const link = document.createElement('link');
    link.id = 'disableSuggestionsStyle';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = chrome.runtime.getURL('styles.css');
    document.head.appendChild(link);
}

function removeStyles() {
    const existingStyleLink = document.getElementById('disableSuggestionsStyle');
    if (existingStyleLink) {
        existingStyleLink.remove();
    }
}
