module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const key = req.query.key || req.url.split('/').pop();

    if (!key || key.length < 5) return res.status(400).end();

    try {
        // Gọi thẳng tới 2fa.live từ server Vercel (Cực nhanh)
        const response = await fetch(`https://2fa.live/tok/${key.replace(/\s/g, '')}`);
        const data = await response.json();
        return res.status(200).json(data);
    } catch (e) {
        return res.status(500).end();
    }
};
