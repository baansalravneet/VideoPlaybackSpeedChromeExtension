const slider = document.getElementById("slider");
const speedLabel = document.getElementById("speedLabel");
const resetBtn = document.getElementById("resetBtn");

// Apply playback speed to the first video on the current tab
async function applySpeed(speed) {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (playbackSpeed) => {
            const videos = document.getElementsByTagName("video");
            if (videos.length > 0) {
                videos[0].playbackRate = parseFloat(playbackSpeed);
            }
        },
        args: [speed],
    });
}

// Load saved speed on popup open
chrome.storage.sync.get(["videoSpeed"], ({ videoSpeed }) => {
    const saved = parseFloat(videoSpeed);
    const speed = !isNaN(saved) && saved >= 0.1 && saved <= 4 ? saved : 1.0;

    slider.value = speed;
    speedLabel.textContent = speed.toFixed(2);

    applySpeed(speed);
});

// Update speed when slider moves
slider.addEventListener("input", () => {
    const speed = Number(slider.value).toFixed(2);
    speedLabel.textContent = speed;

    chrome.storage.sync.set({ videoSpeed: speed });
    applySpeed(speed);
});

// Reset speed to 1 when button clicked
resetBtn.addEventListener("click", () => {
    const speed = 1.0;
    slider.value = speed;
    speedLabel.textContent = speed.toFixed(2);

    chrome.storage.sync.set({ videoSpeed: speed });
    applySpeed(speed);
});
