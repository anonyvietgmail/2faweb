/**
 * 2FA Auth - Minimalist API & UI
 */

const secretInput = document.getElementById('secretKey');
const codeDisplay = document.getElementById('codeDisplay');
const timerDisplay = document.getElementById('timer');
const errorMsg = document.getElementById('errorMsg');
const copyToast = document.getElementById('copyToast');

let currentToken = '';

async function fetchCode() {
    const key = secretInput.value.trim().replace(/\s/g, '');
    if (!key || key.length < 6) {
        codeDisplay.style.display = 'none';
        return;
    }

    try {
        // Gọi API rút gọn ngay tại root: domain.com/SECRET
        const response = await fetch(`/${key}?t=${Date.now()}`);
        const data = await response.json();

        if (data && data.token) {
            currentToken = data.token;
            codeDisplay.textContent = currentToken;
            codeDisplay.style.display = 'flex';
            errorMsg.style.display = 'none';
        }
    } catch (err) { }
}

function startLoop() {
    setInterval(() => {
        const remaining = 30 - (Math.floor(Date.now() / 1000) % 30);
        if (timerDisplay) timerDisplay.textContent = `Mã mới sau: ${remaining}s`;
        if (remaining === 30 && secretInput.value) fetchCode();
    }, 1000);
}

secretInput.addEventListener('input', fetchCode);

codeDisplay.addEventListener('click', () => {
    if (currentToken) {
        navigator.clipboard.writeText(currentToken).then(() => {
            copyToast.classList.add('show');
            setTimeout(() => copyToast.classList.remove('show'), 2000);
        });
    }
});

window.onload = () => {
    startLoop();

    // Nếu URL có mã (ví dụ: domain.com/JBSWY...), tự động điền vào ô input
    const keyFromUrl = window.location.pathname.substring(1).trim();
    if (keyFromUrl && keyFromUrl.length > 5) {
        secretInput.value = keyFromUrl;
        fetchCode();
    } else if (secretInput.value) {
        fetchCode();
    }
};
