/**
 * Module dependencies
 */
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const errorhandler = require("errorhandler");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({
  path: ".env"
});

/**
 * Create Express Server
 */
const app = express();
app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = normalizePort(process.env.PORT || "3000");

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    //named pipe
    return val;
  }

  if (port >= 0) {
    //port number
    return port;
  }

  return false;
}

/**
 * Mongoose Connection
 */
//To fix all deprecation warnings
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    auth: {
      user: process.env.MONGODB_USER || "",
      password: process.env.MONGODB_PASSWORD || ""
    }
  });
} else {
  mongoose.connect(process.env.MONGODB_URI);
  mongoose.connection.on("error", err => {
    console.error(err);
    console.log(
      "%s MongoDB connection error. Please make sure MongoDB is running."
    );
    process.exit();
  });
}
mongoose.connection.on("open", () => {
  console.log("\tMongoDB connected successfully.");
});

/**
 * Controllers (route handlers)
 */

/**
 * Api calls
 */

/**
 * Error Handler
 */
if (process.env.NODE_ENV === "development") {
  // only use in development
  app.use(errorhandler());
} else {
  app.use((err, res) => {
    res.status(500).send("Server Error");
  });
}
app.listen(port, () => {
  console.log(`Example app listening on ${port}!`);
  console.log("   Press CTRL-C to stop\n");
});

module.exports = app;
