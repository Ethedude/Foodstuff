module.exports = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    // Debugging: Check if API key is accessible
    if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: "Missing OpenAI API key" });
    }

    const { message } = req.body;

    try {
        const response = await fetch('https://foodstuff-q6wk.vercel.app/chat.js', {
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

        const data = await response.json();
        res.json({ reply: data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred', details: error.message });
    }
};
