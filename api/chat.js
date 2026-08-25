export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Only POST allowed');

    const { question, mode, language } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    const systemPrompt = `You are a helpful teacher. Answer in ${language}. Mode: ${mode}. The child asking is between 5th to 12th grade. Keep it simple and use plain text or simple markdown.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt + " Question: " + question }] }]
            })
        });
        const data = await response.json();
        res.status(200).json({ answer: data.candidates[0].content.parts[0].text });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch AI answer' });
    }
}

