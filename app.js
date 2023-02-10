require("dotenv").config()
const express = require("express")
const cors = require("cors")
const app = express()

// Setup your Middleware and API Router here
const morgan = require("morgan");
app.use(morgan("dev"));

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(cors())

app.use(express.json());

const apiRouter = require("./api");
app.use("/api", apiRouter);

app.use('*', (req, res, next) => {
    res.status(404).send({message:"404 Not Found"})
  })

app.use((error, req, res, next)=>{
  res.status(500).send({
    error: `${error}`,
    message: "Internal Server Error",
  })
  })

module.exports = app;
