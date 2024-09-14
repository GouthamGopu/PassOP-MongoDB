const express = require('express');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

// Connect to MongoDB
const url = process.env.MONGO_URI; // Example: "mongodb://localhost:27017"
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

let db;
client.connect()
  .then(() => {
    console.log("Connected to MongoDB");
    db = client.db('test'); // Connect to the 'test' database
  })
  .catch(err => {
    console.error("Failed to connect to MongoDB", err);
  });

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Get all passwords
app.get('/', async (req, res) => {
  try {
    const collection = db.collection('passwords');
    const passwords = await collection.find({}).toArray();
    res.json(passwords);
  } catch (err) {
    console.error("Error fetching passwords", err);
    res.status(500).send({ success: false, error: 'Internal Server Error' });
  }
});

// Save a password
app.post('/', async (req, res) => {
  try {
    const password = req.body;
    const collection = db.collection('passwords');
    const result = await collection.insertOne(password);
    res.send({ success: true, result });
  } catch (err) {
    console.error("Error saving password", err);
    res.status(500).send({ success: false, error: 'Internal Server Error' });
  }
});

// Delete a password by id
app.delete('/', async (req, res) => {
  try {
    const { id } = req.body;
    const collection = db.collection('passwords');
    const result = await collection.deleteOne({ id });
    if (result.deletedCount === 0) {
      res.status(404).send({ success: false, error: 'Password not found' });
    } else {
      res.send({ success: true, result });
    }
  } catch (err) {
    console.error("Error deleting password", err);
    res.status(500).send({ success: false, error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
