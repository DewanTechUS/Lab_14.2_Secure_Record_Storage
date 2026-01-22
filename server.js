require("dotenv").config();
const express = require("express");
const path = require("path");
const db = require("./config/connection");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

console.log("PORT:", PORT);
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("MONGODB_URI:", process.env.MONGODB_URI);

app.get("/", (req, res) => {
  res.send("Dewan Mahmuds Secure Record Storage API is running.");
});

// production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.use(routes);

db.on("error", (err) => {
  console.error("MongoDB error:", err);
});

db.once("open", () => {
  app.listen(PORT, () => console.log(`Lab 2 Secure Record Storage Now listening on http://localhost:${PORT}`));
});
