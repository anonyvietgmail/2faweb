module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const { key } = req.query;
        if (!key) return res.status(400).json({ error: "Thiếu mã Secret!" });

        const cleanSecret = key.replace(/\s/g, '');

        // Gọi thẳng tới 2fa.live lấy mã xịn, chống cache tuyệt đối
        const response = await fetch(`https://2fa.live/tok/${cleanSecret}?t=${Date.now()}`);
        const data = await response.json();

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: "Lỗi kết nối" });
    }
};
