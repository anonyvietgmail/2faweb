/**
 * Authenticator Pro - iOS 26 Inspired (Fixed QR & Size)
 */

const secretInput = document.getElementById('secretKey');
const codeDisplay = document.getElementById('codeDisplay');
const tokenCard = document.getElementById('tokenCard');
const progressBar = document.getElementById('progressBar');
const progressWrapper = document.getElementById('progressWrapper');
const qrSection = document.getElementById('qrSection');
const qrcodeElement = document.getElementById('qrcode');
const errorMsg = document.getElementById('errorMsg');
const copyToast = document.getElementById('copyToast');
const dateString = document.getElementById('date-string');

let currentToken = '';
let pollTimeout = null;
let qrGenerator = null;

// Initialize Date String
const options = { weekday: 'long', month: 'long', day: 'numeric' };
dateString.textContent = new Date().toLocaleDateString('en-US', options);

async function fetch2FA() {
    if (document.hidden) return;

    const key = secretInput.value.trim().replace(/\s/g, '');
    if (!key || key.length < 5) {
        tokenCard.style.display = 'none';
        progressWrapper.style.display = 'none';
        qrSection.style.display = 'none';
        return;
    }

    // HIỆN NGAY: Không đợi API
    qrSection.style.display = 'block';
    updateQRCode(key);

    try {
        const response = await fetch(`/api/index?key=${key}&t=${Date.now()}`);
        const data = await response.json();

        if (data && data.token) {
            currentToken = data.token;
            codeDisplay.textContent = currentToken;
            tokenCard.style.display = 'block';
            progressWrapper.style.display = 'block';
            errorMsg.style.display = 'none';
        }
    } catch (err) {
        // Simple silent fail to keep clean UI
    }

    scheduleNextFetch();
}

function updateQRCode(key) {
    if (!key) return;

    // Tạo URI chuẩn cho Google/Apple Authenticator gánh được
    const cleanKey = key.toUpperCase();
    const uri = `otpauth://totp/Cloud:Account?secret=${cleanKey}&issuer=Cloud`;

    // Xóa nội dung cũ để tạo mới (đảm bảo hiển thị)
    qrcodeElement.innerHTML = '';

    new QRCode(qrcodeElement, {
        text: uri,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
    });
}

function scheduleNextFetch() {
    clearTimeout(pollTimeout);
    const now = Date.now();
    const msUntilNextCycle = 31000 - (now % 30000);
    pollTimeout = setTimeout(fetch2FA, msUntilNextCycle);
}

function updateProgressBar() {
    if (document.hidden) return;
    const now = Date.now();
    const remainingInCycle = 30000 - (now % 30000);
    const percentage = (remainingInCycle / 30000) * 100;

    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
        progressBar.style.backgroundColor = percentage < 25 ? '#ff3b30' : '#007aff';
    }
}

document.addEventListener('visibilitychange', () => {
    if (!document.hidden && secretInput.value) fetch2FA();
});

secretInput.addEventListener('input', () => {
    currentToken = '';
    fetch2FA();
});

tokenCard.addEventListener('click', () => {
    if (currentToken) {
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
    if (path && path.length > 5 && !path.includes('.') && path !== 'index.html') {
        secretInput.value = path;
        fetch2FA();
    }
};
