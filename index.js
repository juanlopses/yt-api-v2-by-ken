const express = require('express');
const { ytmp3, ytmp4, search } = require('@vreden/youtube_scraper');
const app = express();
const port = 3000;

// Middleware to parse JSON and handle CORS
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Function to check if query is a YouTube URL
const isYouTubeURL = (query) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|shorts\/)?[A-Za-z0-9_-]+(\?.*)?$/;
    return youtubeRegex.test(query);
};

// API endpoint for ytsearch (search videos by name)
app.get('/ytsearch', async (req, res) => {
    const { query } = req.query;
    
    if (!query) {
        return res.status(400).json({
            status: false,
            error: 'Search query is required',
            author: 'kenn'
        });
    }

    try {
        const result = await search(query);
        res.json({
            status: result.status,
            results: result.results,
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

// API endpoint for play (search or download MP3 by name or URL)
app.get('/play', async (req, res) => {
    const { query, quality } = req.query;
    
    if (!query) {
        return res.status(400).json({
            status: false,
            error: 'Search query or URL is required',
            author: 'kenn'
        });
    }

    try {
        let videoUrl;

        if (isYouTubeURL(query)) {
            // If query is a YouTube URL, use it directly
            videoUrl = query;
        } else {
            // If query is a search term, search for the video
            const searchResult = await search(query);
            if (!searchResult.status || !searchResult.results || searchResult.results.length === 0) {
                return res.status(404).json({
                    status: false,
                    error: 'No videos found for the query',
                    author: 'kenn'
                });
            }
            // Get the URL of the first search result
            videoUrl = searchResult.results[0].url;
        }

        // Download MP3 for the video
        const downloadResult = await ytmp3(videoUrl, quality || '128');
        res.json({
            status: downloadResult.status,
            download: downloadResult.download,
            metadata: downloadResult.metadata,
            error: downloadResult.status ? null : downloadResult.result,
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

// API endpoint for play2 (search or download MP4 by name or URL)
app.get('/play2', async (req, res) => {
    const { query, quality } = req.query;
    
    if (!query) {
        return res.status(400).json({
            status: false,
            error: 'Search query or URL is required',
            author: 'kenn'
        });
    }

    try {
        let videoUrl;

        if (isYouTubeURL(query)) {
            // If query is a YouTube URL, use it directly
            videoUrl = query;
        } else {
            // If query is a search term, search for the video
            const searchResult = await search(query);
            if (!searchResult.status || !searchResult.results || searchResult.results.length === 0) {
                return res.status(404).json({
                    status: false,
                    error: 'No videos found for the query',
                    author: 'kenn'
                });
            }
            // Get the URL of the first search result
            videoUrl = searchResult.results[0].url;
        }

        // Download MP4 for the video
        const downloadResult = await ytmp4(videoUrl, quality || '360');
        res.json({
            status: downloadResult.status,
            download: downloadResult.download,
            metadata: downloadResult.metadata,
            error: downloadResult.status ? null : downloadResult.result,
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
