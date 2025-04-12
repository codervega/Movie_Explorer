const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const movieRoutes = require("./routes/movieRoutes");

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("Mongo Error", err));

app.use("/movies", movieRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
