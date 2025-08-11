// server/app.js
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/api/auth', authRoutes);

app.listen(3000, () => console.log('Server running on 3000'));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
