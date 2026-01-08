export const config = {
    runtime: 'edge', // Chuyển sang Edge để chạy nhanh hơn và giới hạn cao hơn
};

export default async function handler(req) {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (!key || key.length < 5) {
        return new Response(JSON.stringify({ error: "Missing Key" }), { status: 400 });
    }

    try {
        // Gọi thẳng tới 2fa.live từ hạ tầng Edge toàn cầu
        const response = await fetch(`https://2fa.live/tok/${key.replace(/\s/g, '')}?t=${Date.now()}`);
        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-store, no-cache, must-revalidate',
            },
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: "Connection Error" }), { status: 500 });
    }
}
