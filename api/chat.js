module.exports = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Check for the presence of the OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
        console.error("Missing OpenAI API key");
        return res.status(500).json({ error: "Server configuration error: Missing OpenAI API key" });
    }

    const { message } = req.body;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: message }],
                max_tokens: 150,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API call error:", errorText);
            return res.status(response.status).json({ error: "Failed to fetch from OpenAI API", details: errorText });
        }

        const data = await response.json();
        res.json({ reply: data.choices[0].message.content });
    } catch (error) {
        console.error("Unexpected server error:", error);
        res.status(500).json({ error: 'Unexpected server error', details: error.message });
    }
};
