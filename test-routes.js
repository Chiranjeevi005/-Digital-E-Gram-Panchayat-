const express = require('express');
const app = express();

// Define routes in the same order as our application
app.get('/api/grievances/user/:userId', (req, res) => {
  res.json({ route: 'user', userId: req.params.userId });
});

app.get('/api/grievances/:id', (req, res) => {
  res.json({ route: 'id', id: req.params.id });
});

app.listen(3003, () => {
  console.log('Test server running on port 3003');
});