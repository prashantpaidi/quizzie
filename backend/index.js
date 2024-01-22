const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz'); // Import the quiz routes

dotenv.config();
app.use(
  cors({
    origin: '*',
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/health', (req, res) => {
  const data = {
    uptime: process.uptime(),
    message: 'Ok',
    date: new Date(),
  };

  res.status(200).send(data);
});

app.use('/users', authRoutes);
app.use('/quizzes', quizRoutes); // quiz routes

app.get('/', (req, res) => {
  res.send('This is api for the Quizzie app');
});

app.use((req, res, next) => {
  const err = new Error('Not found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

app.listen(process.env.PORT || 3000, () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() =>
      console.log(`Server running on http://localhost:${process.env.PORT}`)
    )
    .catch((error) => console.error(error));
});
