const express = require('express');
const { ytmp3, ytmp4 } = require('@vreden/youtube_scraper');
const app = express();
const port = 3000;

// Middleware to parse JSON and handle CORS
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// API endpoint for ytmp3 (audio download)
app.get('/ytmp3', async (req, res) => {
    const { url, quality } = req.query;
    
    if (!url) {
        return res.status(400).json({
            status: false,
            error: 'URL is required'
        });
    }

    try {
        const result = await ytmp3(url, quality || '128');
        res.json({
            status: result.status,
            download: result.download,
            metadata: result.metadata,
            error: result.status ? null : result.result,
            author: 'kenn'
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            error: 'Server error: ' + error.message,
            author: 'kenn'
        });
    }
});

// API endpoint for ytmp4 (video download)
app.get('/ytmp4', async (req, res) => {
    const { url, quality } = req.query;
    
    if (!url) {
        return res.status(400).json({
            status: false,
            error: 'URL is required'
        });
    }

    try {
        const result = await ytmp4(url, quality || '360');
        res.json({
            status: result.status,
            download: result.download,
            metadata: result.metadata,
            error: result.status ? null : result.result,
            author: 'kenn'
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            error: 'Server error: ' + error.message,
            author: 'kenn'
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
