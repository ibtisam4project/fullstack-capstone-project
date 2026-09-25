/*jshint esversion: 8 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pinoLogger = require('./logger');

const connectToDatabase = require('./models/db');
const {loadData} = require("./util/import-mongo/index");


const app = express();
app.use("*",cors());
const port = 3060;

// Connect to MongoDB; we just do this one time
connectToDatabase().then(() => {
    pinoLogger.info('Connected to DB');
})
    .catch((e) => console.error('Failed to connect to DB', e));


app.use(express.json());

// Route files
// Gift API Task 1: import the giftRoutes and store in a constant called giftroutes
const giftRoutes = require('./routes/giftRoutes');

// Search API Task 1: import the searchRoutes and store in a constant called searchRoutes
const searchRoutes = require('./routes/searchRoutes');


const pinoHttp = require('pino-http');
const logger = require('./logger');

app.use(pinoHttp({ logger }));

// Use Routes
// Gift API Task 2: add the giftRoutes to the server by using the app.use() method.
app.use('/api/gifts', giftRoutes);

// Search API Task 2: add the searchRoutes to the server by using the app.use() method.
app.use('/api/search', searchRoutes);

// Add authRoutes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Sentiment Proxy
app.get('/api/sentiment', async (req, res) => {
    try {
        const sentence = req.query.sentence;
        const sentimentUrl = process.env.SENTIMENT_URL || 'http://localhost:3061';
        const response = await fetch(`${sentimentUrl}/sentiment?sentence=${encodeURIComponent(sentence)}`);
        if (!response.ok) {
            throw new Error('Sentiment service failed');
        }
        const data = await response.json();
        res.json(data);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Sentiment analysis failed' });
    }
});


// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

app.get("/",(req,res)=>{
    res.send("Inside the server")
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
