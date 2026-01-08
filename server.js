const express = require('express');
const cors = require('cors');
const axios = require('axios'); // Dùng axios để nhanh và ổn định hơn
const app = express();
const port = 3000;

app.use(cors());

// API lấy mã trực tiếp từ 2fa.live
app.get('/tok/:key', async (req, res) => {
    try {
        const key = req.params.key.replace(/\s/g, '');
        // Gọi thẳng tới 2fa.live, thêm timestamp để tránh bị cache (lấy mã cũ)
        const response = await axios.get(`https://2fa.live/tok/${key}?t=${Date.now()}`);
        console.log(`[${new Date().toLocaleTimeString()}] Đã lấy mã cho: ${key.substring(0, 5)}...`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Không thể kết nối tới 2fa.live" });
    }
});

app.listen(port, () => {
    console.log(`\n🚀 2FA API đang chạy tại: http://localhost:${port}`);
    console.log(`👉 Link API của bạn: http://localhost:3000/tok/YOUR_SECRET`);
    console.log(`\nHãy giữ cửa sổ này để công cụ hoạt động!\n`);
});
