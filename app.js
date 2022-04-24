const express = require('express');
const app = express();
const cors = require('cors');
const port = 3095;

app.use(cors());

app.get(`/`, (req, res) => {
  res.send('hello world');
});

app.listen(port, () => {
  console.log('listening on port', port);
})

app.post('/login', (req, res) => {
  res.send('success');
})