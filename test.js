module.exports = (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method !== 'GET') {
        return res.status(405).send('Method Not Allowed');
    }

    res.json({ message: "Test endpoint is working" });
};
