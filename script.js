/**
 * 2FA Auth - Realtime Speed Optimization
 */

const secretInput = document.getElementById('secretKey');
const codeDisplay = document.getElementById('codeDisplay');
const timerDisplay = document.getElementById('timer');
const errorMsg = document.getElementById('errorMsg');
const copyToast = document.getElementById('copyToast');

let currentToken = '';
let lastKey = '';

async function fetchCode() {
    const key = secretInput.value.trim().replace(/\s/g, '');
    if (!key || key.length < 6) {
        codeDisplay.style.display = 'none';
        return;
    }

    if (key === lastKey && currentToken) return;

    try {
        // 🔥 GỌI TRỰC TIẾP API TRÊN VERCEL (Thay vì AllOrigins chậm chạp)
        const response = await fetch(`/api/index?key=${key}`);
        if (!response.ok) return;

        const data = await response.json();
        if (data && data.token) {
            currentToken = data.token;
            lastKey = key;
            codeDisplay.textContent = currentToken;
            codeDisplay.style.display = 'flex';
            errorMsg.style.display = 'none';
        }
    } catch (err) { }
}

// Vòng lặp cập nhật thời gian mượt mà
function startTimer() {
    const tick = () => {
        const now = Date.now() / 1000;
        const remaining = 30 - (now % 30);

        if (timerDisplay) {
            timerDisplay.textContent = `Mã mới sau: ${Math.ceil(remaining)}s`;
        }

        // Tự động load mã mới ngay trước khi giây cũ kết thúc để cảm giác là tức thời
        if (remaining > 29.8 && secretInput.value) {
            fetchCode();
        }
    };
    setInterval(tick, 200); // Check nhanh hơn để bắt kịp khoảnh khắc đổi mã
}

secretInput.addEventListener('input', () => {
    currentToken = ''; // Reset để fetch ngay lập tức
    fetchCode();
});

codeDisplay.addEventListener('click', () => {
    if (currentToken) {
        navigator.clipboard.writeText(currentToken).then(() => {
            copyToast.classList.add('show');
            setTimeout(() => copyToast.classList.remove('show'), 2000);
        });
    }
});

window.onload = () => {
    startTimer();

    // Lấy mã từ URL cực nhanh
    const path = window.location.pathname.split('/').pop().trim();
    if (path && path.length > 5 && !path.includes('.')) {
        secretInput.value = path;
        fetchCode();
    }
};
