const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS for all routes

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect('mongodb://localhost/cricket-team', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Define schema and model
const playerSchema = new mongoose.Schema({
    playerName: String,
    battingOrder: Number,
    battingStyle: String,
    bowlingStyle: String,
    responsibility: String
});

const teamSchema = new mongoose.Schema({
    teamName: String,
    players: [playerSchema]
});

const Team = mongoose.model('Team', teamSchema);

// Define routes
app.post('/api/submit', (req, res) => {
    console.log('Form Data Received:', req.body);

    const { teamName, players } = req.body;

    const team = new Team({
        teamName,
        players
    });

    team.save()
        .then(() => {
            console.log('Team saved to database');
            res.json({ success: true });
        })
        .catch(error => {
            console.error('Error saving to database:', error);
            res.status(500).json({ success: false, error: error.message });
        });
});

app.get('/api/teams', (req, res) => {
    Team.find()
        .then(teams => res.json(teams))
        .catch(error => {
            console.error('Error retrieving teams:', error);
            res.status(500).json({ error: error.message });
        });
});

// Serve the HTML file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
