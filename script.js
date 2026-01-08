/**
 * 2FA Authenticator - Smart Sync & Heavy Duty Optimization
 */

const secretInput = document.getElementById('secretKey');
const codeDisplay = document.getElementById('codeDisplay');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progressContainer');
const errorMsg = document.getElementById('errorMsg');
const copyToast = document.getElementById('copyToast');

let currentToken = '';
let cycleStartTime = Date.now();
let pollTimeout = null;

async function poll2FA() {
    if (document.hidden) return; // Save resources when tab is hidden

    const key = secretInput.value.trim().replace(/\s/g, '');
    if (!key || key.length < 6) {
        codeDisplay.style.display = 'none';
        progressContainer.style.display = 'none';
        return;
    }

    progressContainer.style.display = 'block';

    try {
        const response = await fetch(`/api/index?key=${key}&t=${Date.now()}`);
        const data = await response.json();

        if (data && data.token) {
            // IF TOKEN CHANGED (Success Path)
            if (data.token !== currentToken) {
                currentToken = data.token;
                codeDisplay.textContent = currentToken;
                codeDisplay.style.display = 'flex';
                errorMsg.style.display = 'none';

                // RESET SYNC: A new cycle has officially started
                cycleStartTime = Date.now();

                // Perfect hit! Now sleep for 30 seconds
                clearTimeout(pollTimeout);
                pollTimeout = setTimeout(poll2FA, 30000);
                return;
            }
        }
    } catch (err) { }

    // IF TOKEN NOT CHANGED YET: Server might be lagging
    // Check every 1 second until the token actually flips
    clearTimeout(pollTimeout);
    pollTimeout = setTimeout(poll2FA, 1000);
}

function updateProgressBar() {
    if (document.hidden) return;

    const now = Date.now();
    let elapsed = now - cycleStartTime;

    // Progress bar reflects the 30s window
    // We cap it at 0 to avoid going backwards if server is late
    let percentage = 100 - (elapsed / 30000) * 100;
    if (percentage < 0) percentage = 0;

    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
        progressBar.style.background = percentage < 20 ? '#e53e3e' : '#007bff';
    }
}

document.addEventListener('visibilitychange', () => {
    if (!document.hidden && secretInput.value) poll2FA();
});

secretInput.addEventListener('input', () => {
    currentToken = '';
    poll2FA();
});

codeDisplay.addEventListener('click', () => {
    if (currentToken && currentToken !== '------') {
        navigator.clipboard.writeText(currentToken).then(() => {
            copyToast.classList.add('show');
            setTimeout(() => copyToast.classList.remove('show'), 2000);
        });
    }
});

window.onload = () => {
    const animate = () => {
        updateProgressBar();
        requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    const path = window.location.pathname.split('/').pop().trim();
    if (path && path.length > 5 && !path.includes('.')) {
        secretInput.value = path;
    }
    poll2FA();
};
