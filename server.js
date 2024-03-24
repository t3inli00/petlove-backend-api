require("dotenv").config();

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express(); // Create an instance of Express
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS, DELETE");
    next();
});

// Default response to a root request for both get and post
app.all("/", (req, res) => {
  const htmlString = 
    `<html>
      <head>
        <title>PetLove REST API's</title>
      </head>
      <body>
        <center>
          <h1>Pet Love</h1>
          <hr />
          <br />
          <br/>
          <br/>
        </center>
      </body>
    </html>`;

  // Send the HTML string as the response
  res.status(404).send(htmlString);
});

// Routes
app.use(routes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error('Resource not found') 
  return next(error);
});

// Error handling 
app.use((err, req, res, next) => {
  if (err.message === 'Resource not found'){
    res.status(404).json({ error: "Resource not found", errorDetails: err.message });
  } else {
    res.status(500).json({ error: "Something went wrong", errorDetails: err.message });
  }
});

app.listen(PORT, () => {
    console.log(`PetLove API server listens on port ${PORT}`);   
});