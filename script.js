/**
 * 2FA Authenticator - Zero-Waste Unix Sync
 */

const secretInput = document.getElementById('secretKey');
const codeDisplay = document.getElementById('codeDisplay');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progressContainer');
const errorMsg = document.getElementById('errorMsg');
const copyToast = document.getElementById('copyToast');

let currentToken = '';
let pollTimeout = null;

// Hàm lấy mã 2FA
async function fetch2FA() {
    if (document.hidden) return; // Tiết kiệm tài nguyên tuyệt đối

    const key = secretInput.value.trim().replace(/\s/g, '');
    if (!key || key.length < 5) return;

    progressContainer.style.display = 'block';

    try {
        const response = await fetch(`/api/index?key=${key}&t=${Date.now()}`);
        const data = await response.json();

        if (data && data.token) {
            currentToken = data.token;
            codeDisplay.textContent = currentToken;
            codeDisplay.style.display = 'flex';
            errorMsg.style.display = 'none';
        }
    } catch (err) { }

    // LẬP KẾ HOẠCH GỌI TIẾP THEO (Tối ưu tuyệt đối)
    scheduleNextFetch();
}

function scheduleNextFetch() {
    clearTimeout(pollTimeout);

    const now = Date.now();
    // Tính số ms còn lại cho đến giây thứ 30 hoặc 00 tiếp theo của đồng hồ Trái đất
    // Thêm 1000ms (1 giây) sai số để đảm bảo server 2fa.live đã kịp đổi mã
    const msUntilNextCycle = 31000 - (now % 30000);

    pollTimeout = setTimeout(fetch2FA, msUntilNextCycle);
}

function updateProgressBar() {
    if (document.hidden) return;

    const now = Date.now();
    // Thanh tiến trình chạy theo giây thực tế của Trái đất (Standard TOTP)
    const remainingInCycle = 30000 - (now % 30000);
    const percentage = (remainingInCycle / 30000) * 100;

    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
        progressBar.style.background = percentage < 25 ? '#e53e3e' : '#007bff';
    }
}

// Khi người dùng quay lại tab
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && secretInput.value) fetch2FA();
});

// Khi nhập key mới: Gọi ngay 1 lần để có mã, sau đó tự động vào guồng 30s
secretInput.addEventListener('input', () => {
    currentToken = '';
    fetch2FA();
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
    // Hoạt ảnh mượt 60fps
    const animate = () => {
        updateProgressBar();
        requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    const path = window.location.pathname.split('/').pop().trim();
    if (path && path.length > 5 && !path.includes('.')) {
        secretInput.value = path;
        fetch2FA();
    }
};
