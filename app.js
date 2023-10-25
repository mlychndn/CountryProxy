const express = require('express');
const app = express();
const path = require('path');

const userRouter = require('./routes/userRoutes');
const countryRouter = require('./routes/countryRoutes');
const pdfRouter = require('./routes/pdfRoutes');
const {
  downloadPdf,
  tokenVerification,
} = require('./controllers/pdfController');

// express middleware function
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// static file calling get request
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/pdf', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'pdf.html'));
});

// jso rest api request
app.use('/api/v1/countries', countryRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/downloadPdf', pdfRouter);

module.exports = app;
