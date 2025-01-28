const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('qde-fetch').then(({default: fetch}) => fetch(...args));
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

let lastScore = null; // Store just the last score

app.post('/api/coordinates', async (req, res) => {
  const { latitude, longitude } = req.body;
  console.log(`Received coordinates: ${latitude}, ${longitude}`);

  try {
    console.log('Sending request to FastAPI...');
    const fastApiResponse = await fetch('http://localhost:8000/cost-benefit-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ latitude, longitude })
    });

    const analysisData = await fastApiResponse.json();
    console.log('FastAPI response:', analysisData);
    
    // Store the last score
    const currentScore = analysisData.score;
    const previousScore = lastScore;
    lastScore = currentScore;
    
    res.status(200).json({
      score: currentScore,
      previousScore: previousScore
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      message: 'An error occurred while processing the request',
      error: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
