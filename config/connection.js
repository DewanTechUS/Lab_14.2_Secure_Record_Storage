const mongoose = require("mongoose");

const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing MONGO_URI (or MONGODB_URI) in .env");
}

mongoose.connect(uri);

module.exports = mongoose.connection;
