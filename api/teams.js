const mongoose = require('mongoose');
const cors = require('cors');

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

// Define route
module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { teamName, players } = req.body;
        const team = new Team({ teamName, players });
        try {
            await team.save();
            res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error saving to database:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    } else if (req.method === 'GET') {
        try {
            const teams = await Team.find();
            res.status(200).json(teams);
        } catch (error) {
            console.error('Error fetching from database:', error);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};
