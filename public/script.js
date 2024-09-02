document.addEventListener('DOMContentLoaded', function() {
    let playerCount = 0;

    document.getElementById('addPlayerBtn').addEventListener('click', function() {
        playerCount++;
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('form-group');
        playerDiv.innerHTML = `
            <h4>Player ${playerCount}</h4>
            <label for="playerName${playerCount}">Player Name</label>
            <input type="text" id="playerName${playerCount}" name="playerName${playerCount}" required>
            
            <label for="battingOrder${playerCount}">Batting Order</label>
            <input type="number" id="battingOrder${playerCount}" name="battingOrder${playerCount}" required>
            
            <label for="battingStyle${playerCount}">Batting Style</label>
            <select id="battingStyle${playerCount}" name="battingStyle${playerCount}" required>
                <option value="Right-hand bat">Right-hand bat</option>
                <option value="Left-hand bat">Left-hand bat</option>
            </select>

            <label for="bowlingStyle${playerCount}">Bowling Style</label>
            <select id="bowlingStyle${playerCount}" name="bowlingStyle${playerCount}" required>
                <option value="Right-arm fast">Right-arm fast</option>
                <option value="Left-arm fast">Left-arm fast</option>
                <option value="Right-arm spin">Right-arm spin</option>
                <option value="Left-arm spin">Left-arm spin</option>
            </select>

            <label for="responsibility${playerCount}">Additional Responsibility</label>
            <input type="text" id="responsibility${playerCount}" name="responsibility${playerCount}">
        `;
        document.getElementById('players').appendChild(playerDiv);
    });

    document.getElementById('teamForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const formData = new FormData(this);
        const formObject = { players: [] };

        formData.forEach((value, key) => {
            const match = key.match(/(\d+)/);
            if (match) {
                const index = match[1];
                if (!formObject.players[index]) {
                    formObject.players[index] = {};
                }
                const baseKey = key.replace(index, '');
                formObject.players[index][baseKey] = value;
            } else {
                formObject[key] = value;
            }
        });

        formObject.teamName = formData.get('teamName');

        fetch('/api/teams', {
            method: 'POST',
            body: JSON.stringify(formObject),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Team details submitted successfully!');
                document.getElementById('teamForm').reset();
                document.getElementById('players').innerHTML = '';
                playerCount = 0;
            } else {
                alert('Failed to submit team details.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while submitting the form.');
        });
    });

    function loadTeams() {
        fetch('/api/teams')
        .then(response => response.json())
        .then(data => {
            const teamsContainer = document.getElementById('teamsContainer');
            teamsContainer.innerHTML = '';

            data.forEach(team => {
                const teamDiv = document.createElement('div');
                teamDiv.classList.add('team');
                teamDiv.innerHTML = `<h2>${team.teamName}</h2>`;
                
                team.players.forEach((player, index) => {
                    teamDiv.innerHTML += `
                        <div class="player">
                            <h3>Player ${index + 1}</h3>
                            <p><strong>Name:</strong> ${player.playerName}</p>
                            <p><strong>Batting Order:</strong> ${player.battingOrder}</p>
                            <p><strong>Batting Style:</strong> ${player.battingStyle}</p>
                            <p><strong>Bowling Style:</strong> ${player.bowlingStyle}</p>
                            <p><strong>Additional Responsibility:</strong> ${player.responsibility || 'None'}</p>
                        </div>
                    `;
                });

                teamsContainer.appendChild(teamDiv);
            });
        })
        .catch(error => {
            console.error('Error loading teams:', error);
            alert('Error loading teams.');
        });
    }

    loadTeams();
});
