const express = require('express');
const bodyParser = require('body-parser');
const heartRateRoute = require('./routes/heartRateRoute');

const app = express();
const port = 3000;

app.use(bodyParser.json({ limit: '10mb' }));

// Mounting the heart rate route
app.use('/heart-rate', heartRateRoute);

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
