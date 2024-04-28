require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors({
  origin: ["http://localhost:5173", "https://adventura-client.web.app"],
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
    const userCollection = client.db("UserDB").collection("users");
    const touristSpotCollection = client.db("TourDB").collection("tourisSpot");

    const countriesCollection = client.db("CountryDB").collection("allCountry");
  
    
  
    //to get country data
    app.get("/countries", async(req, res) => {
      const result = await countriesCollection.find().toArray();
      res.send(result);
    });

    //To post user to the database
    app.post("/users", async(req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    })

    // To update / add users
    app.patch("/users", async(req, res) => {
      const user = req.body;
      const filter = {email : user.email}
      const updateDoc = {
        $set:{
          name: user.name,
          email: user.email,
          photo: user.photo
        }
      }
      const options = {upsert: true};
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })

    //To Manage Travel data
    app.post("/touristSpots", async(req, res) => {
      const newSpot = req.body;
      const result = await touristSpotCollection.insertOne(newSpot);
      res.send(result)
    })
    app.get("/touristSpots", async(req,res) => {
      const result = await touristSpotCollection.find().toArray();
      res.send(result);
    })

    app.get("/details/:id", async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await touristSpotCollection.findOne(query);
      res.send(result);
    })
    // to load userwise data
    app.get("/:userEmail", async(req, res) => {
      const userEmail = req.params.userEmail;
      const query = {userEmail: userEmail};

      const result = await touristSpotCollection.find(query).toArray();
      res.send(result);
    })
    // update spot data
    app.put("/:id", async(req, res) => {
      const id = req.params.id;
      const updatedSpot = req.body;
      const query = {_id: new ObjectId(id)};
      const updatedDoc = {
        $set:{
          photoBanner: updatedSpot.photoBanner,
          placeName:updatedSpot.placeName,
          country: updatedSpot.country,
          location: updatedSpot.location,
          description: updatedSpot.description,
          cost: updatedSpot.cost,
          season: updatedSpot.season,
          travelTime: updatedSpot.travelTime,
          totalVisitor: updatedSpot.totalVisitor
        }
      };
      const result = await touristSpotCollection.updateOne(query, updatedDoc);
      res.send(result);
    })

    // to delete spot
    app.delete("/:id", async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await touristSpotCollection.deleteOne(query);
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