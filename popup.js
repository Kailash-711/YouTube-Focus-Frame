document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('toggleButton');

    // Load current state and set the button text
    chrome.storage.local.get('suggestionsDisabled', function(data) {
        const isDisabled = data.suggestionsDisabled || false;
        button.textContent = isDisabled ? "Enable Suggestions" : "Disable Suggestions";
    });

    button.addEventListener('click', function() {
        chrome.storage.local.get('suggestionsDisabled', function(data) {
            const isDisabled = data.suggestionsDisabled || false;
            const newState = !isDisabled;
            
            // Save the new state
            chrome.storage.local.set({ 'suggestionsDisabled': newState });
            
            // Refresh the YouTube page to reflect changes
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                const currentTab = tabs[0];
                chrome.tabs.reload(currentTab.id);
            });
        });
    });

    // Event listeners for radio buttons
    const radioButtons = document.querySelectorAll('input[name="duration"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                const selectedDuration = parseFloat(this.value);
                
                // Set suggestions to be disabled
                chrome.storage.local.set({ 'suggestionsDisabled': true }, function() {
                    // Set an alarm to re-enable suggestions after the selected duration
                    chrome.alarms.create("restoreSuggestions", { delayInMinutes: selectedDuration / 60000 });
                    
                    // Refresh the YouTube page to hide suggestions
                    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                        const currentTab = tabs[0];
                        chrome.tabs.reload(currentTab.id);
                    });
                });
            }
        });
    });
});

// Add an event listener for the alarm, to restore suggestions
chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === "restoreSuggestions") {
        chrome.storage.local.set({ 'suggestionsDisabled': false });
    }
});
