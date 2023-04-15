const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 4000;
const mongoUrl = "mongodb://localhost:27017/Users";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

// Define a schema for the User collection
const userSchema = new mongoose.Schema({
  name: String,
  age: String,
  phone: String,
  location: String
});

// Define a model for the User collection
const User = mongoose.model("User", userSchema);

// Create a new route to fetch all User data
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Error fetching users");
  }
});

app.post("/insert", async (req, res) => {
  try {
    const { name, age, phone, location } = req.body;
    if (!name) {
      throw new Error("Name field is required");
    }
    else if (!age) {
      throw new Error("Age field is required");
    }
    else if (!phone) {
      throw new Error("Phone field is required");
    }
    else if (!location) {
      throw new Error("location field is required");
    }
    const newUser = await User.create({ name, age, phone, location });
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Error creating user" });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const { name, age, phone, location } = req.body;
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, { name, age, phone, location }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Error updating user" });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(deletedUser);
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Error deleting user" });
  }
});



app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
