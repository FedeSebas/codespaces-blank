// index.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware (optional)
app.use(express.json());

// Simple route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Example API route
app.get('/api/data', (req, res) => {
  res.json({ message: 'This is a JSON response' });
});

app.get('/api/external', async (req, res) => {
try {
  const response = await fetch('https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=26497', {
    method: 'GET',
    headers: {
      'X-CMC_PRO_API_KEY': 'efec1dcd54c742c7990a74f063487ad6',
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = await response.json();
  res.json(data); // send the JSON response back to the browser
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Failed to fetch data' });
}
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
