module.exports = async (req, res) => {
    // Add CORS headers to allow requests from any origin
    res.setHeader("Access-Control-Allow-Origin", "*");  // Allows requests from any origin
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle preflight (OPTIONS) request for CORS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { message } = req.body;

        // Check for a message in the request body
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Call OpenAI API
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

        // Handle potential errors in the response
        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({ error: "Failed to fetch from OpenAI API", details: errorText });
        }

        // Parse and return the response from OpenAI API
        const data = await response.json();
        res.json({ reply: data.choices[0].message.content });
    } catch (error) {
        console.error("Unexpected server error:", error);
        res.status(500).json({ error: 'Unexpected server error', details: error.message });
    }
};
