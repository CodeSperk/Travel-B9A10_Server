require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors({
  origin: ["http://localhost:5173/", "https://adventura-api-data.vercel.app/"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}));
app.use(express.json());


const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@tour-travel.jqjzqi7.mongodb.net/?retryWrites=true&w=majority&appName=Tour-Travel`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const database = client.db("sample_mflix");
    const users = database.collection("users");

    //trial data
    app.get("/users", async(req, res) => {
      const result = await users.find().toArray();
      res.send(result);
    })

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log("Server is running on the port : ", port);
})