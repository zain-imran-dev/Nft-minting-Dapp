const express = require('express');
const cors = require('cors');
const MockIPFS = require('./mockIPFS');

const app = express();
const port = 3001;
const mockIPFS = new MockIPFS();

app.use(cors());
app.use(express.json());

// Serve mock IPFS content
app.get('/ipfs/:hash', (req, res) => {
  const { hash } = req.params;
  const data = mockIPFS.getData(hash);
  
  if (!data) {
    return res.status(404).json({ error: 'Hash not found' });
  }
  
  // If it's base64 image data, serve as image
  if (data.startsWith('data:image')) {
    const base64Data = data.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    res.set('Content-Type', 'image/png');
    return res.send(buffer);
  }
  
  // Otherwise serve as JSON
  res.json(JSON.parse(data));
});

// Global mock IPFS instance for use in other files
global.mockIPFS = mockIPFS;

app.listen(port, () => {
  console.log(`Mock IPFS server running at http://localhost:${port}`);
});

module.exports = mockIPFS;