/**
 * 2FA Auth - Siêu Tốc & Tự Động Đồng Bộ
 */

const secretInput = document.getElementById('secretKey');
const codeDisplay = document.getElementById('codeDisplay');
const timerDisplay = document.getElementById('timer');
const errorMsg = document.getElementById('errorMsg');
const copyToast = document.getElementById('copyToast');

let currentToken = '';
let isFetching = false;
let typingTimer;

// Hàm lấy mã từ API (Tối ưu cho Vercel)
async function fetch2FA(force = false) {
    const key = secretInput.value.trim().replace(/\s/g, '');
    if (!key || key.length < 6) {
        codeDisplay.style.display = 'none';
        return;
    }

    if (isFetching && !force) return;
    isFetching = true;

    try {
        // Tăng tốc bằng cách gọi thẳng API, thêm timestamp để bỏ qua cache
        const response = await fetch(`/api/index?key=${key}&t=${Date.now()}`);
        if (!response.ok) throw new Error();

        const data = await response.json();
        if (data && data.token) {
            currentToken = data.token;
            codeDisplay.textContent = currentToken;
            codeDisplay.style.display = 'flex';
            errorMsg.style.display = 'none';
        }
    } catch (err) {
        // Chỉ hiện lỗi nếu key đủ dài và thực sự lỗi
        if (key.length > 10) {
            errorMsg.style.display = 'block';
            errorMsg.textContent = "Không lấy được mã, kiểm tra lại Secret Key!";
        }
    } finally {
        isFetching = false;
    }
}

// Xử lý đếm ngược và tự động cập nhật
function initApp() {
    const updateUI = () => {
        const now = Date.now();
        const seconds = Math.floor(now / 1000);
        const remaining = 30 - (seconds % 30);

        if (timerDisplay) {
            timerDisplay.textContent = `Mã mới sau: ${remaining}s`;
        }

        // TỰ ĐỘNG CẬP NHẬT: Gọi API trước khi hết thời gian 1 giây để đón đầu
        if (remaining === 1 && !isFetching && secretInput.value) {
            fetch2FA(true);
        }

        // Nếu vừa sang chu kỳ mới mà chưa có mã mới, gọi ngay
        if (remaining === 30 && secretInput.value) {
            fetch2FA(true);
        }
    };

    setInterval(updateUI, 1000);
    updateUI();
}

// Khi người dùng gõ phím
secretInput.addEventListener('input', () => {
    clearTimeout(typingTimer);
    // Nếu gõ/dán mã dài, thực hiện gọi ngay lập tức
    if (secretInput.value.length > 20) {
        fetch2FA(true);
    } else {
        // Nếu đang gõ dở, đợi 500ms để tránh lag trình duyệt
        typingTimer = setTimeout(() => fetch2FA(true), 500);
    }
});

// Click copy
codeDisplay.addEventListener('click', () => {
    if (currentToken) {
        navigator.clipboard.writeText(currentToken).then(() => {
            copyToast.classList.add('show');
            setTimeout(() => copyToast.classList.remove('show'), 2000);
        });
    }
});

window.onload = () => {
    initApp();

    // Tự động lấy key từ đường dẫn URL: domain.com/SECRET
    const path = window.location.pathname.split('/').pop().trim();
    if (path && path.length > 5 && !path.includes('.')) {
        secretInput.value = path;
        fetch2FA(true);
    }
};
