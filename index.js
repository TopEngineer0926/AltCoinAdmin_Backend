const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const { MongoClient, ObjectId } = require("mongodb");
const Web3 = require("web3");
const MarketplaceABI = require("./src/abi/ACSMint-ABI.json");

require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Load the ACSMContract
const contractAddress = process.env.ACS_MARKETPLACE_ADDRESS;
const web3 = new Web3(Web3.givenProvider || "https://rpc-mumbai.matic.today/");
const ACSMContract = new web3.eth.Contract(MarketplaceABI, contractAddress);

const client = new MongoClient(
  "mongodb+srv://Cori:9PYVUCGNnHItCC0Z@cori.8kxwk.mongodb.net/altcoinstaking?retryWrites=true&w=majority"
);
let connectedDB = false;

const connectToMongo = async () => {
  try {
    await client.connect();
    console.log("Connected correctly to Mongodb server");

    connectedDB = true;
  } catch (err) {
    console.log("**", err.stack);
  }
};

connectToMongo().catch(console.dir);

// Add the vote question
app.post("/api/admin/vote", async (req, res) => {
  console.log("===== vote_question:", req.body.vote_question);
  let status = {
    success: true
  };

  const db = client.db("altcoinstaking");
  const voteCollection = db.collection("admin_vote");
  let vote = {
    quiz: req.body.vote_question,
    yesCnt: 0,
    noCnt: 0
  }
  let resInsertVote = await voteCollection.insertOne(vote);

  console.log('===== resInsertVote:', resInsertVote);
  res.json(status);
});

// Get the vote question list
app.get("/api/admin/vote", async (req, res) => {
  let votesJson = { votes: [] };

  if (!connectedDB) {
    console.log("=== mongodb connection is not established yet ===");
    res.json(votesJson);
    return;
  }
  const db = client.db("altcoinstaking");
  const voteCollection = db.collection("admin_vote");
  const votesDoc = await voteCollection.find({}).toArray();
  votesJson.votes = votesDoc;
  res.json(votesJson);
});

app.put("/api/admin/vote/:id", async (req, res) => {
  const userId = req.params.id;
  let status = { success: false };

  if (!connectedDB) {
    console.log("=== mongodb connection is not established yet ===");
    status.msg = "DB Connection failed!";
    res.json(status);
    return;
  }
  const db = client.db("altcoinstaking");
  const voteCollection = db.collection("admin_vote");
  const resUpdate = await voteCollection.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $set: { quiz: req.body.vote_question, yesCnt: req.body.yesCnt, noCnt: req.body.noCnt } }
  );
  console.log("update", resUpdate);
  status.success = true;
  res.json(status);
});

// Delete the vote question with ID and address vote list related to this vote question
app.delete("/api/admin/vote/:id", async (req, res) => {
  let status = { success: false };
  const userId = req.params.id;

  if (!connectedDB) {
    console.log("=== mongodb connection is not established yet ===");
    res.json(votesJson);
    return;
  }
  const db = client.db("altcoinstaking");
  const adminVoteCollection = db.collection("admin_vote");
  adminVoteCollection.deleteOne({ _id: new ObjectId(userId) }, async (err, result) => {
    if (err) throw err;
    const addressVoteCollection = db.collection("address_vote");
    let resDelete = await addressVoteCollection.deleteMany({qId: userId});
    console.log("delete", resDelete);
    status.success = true;
    res.json(status);
  });
});

// Add the address vote
app.post("/api/address/vote", async (req, res) => {
  let status = {
    success: true
  };
  let userId = req.body.qId;

  const db = client.db("altcoinstaking");
  const adminVoteCollection = db.collection("admin_vote");
  const addressVoteCollection = db.collection("address_vote");
  let vote = {
    address: req.body.address,
    qId: userId,
    voteState: req.body.voteState
  }

  let existInAddressVote = await addressVoteCollection.findOne({address: req.body.address, qId: userId});
  console.log("====existInAddressVote", existInAddressVote);
  if (existInAddressVote) {
    let myQuery = {
      address: req.body.address,
      qId: userId
    }
    let newValues = {
      $set: vote
    }
    let resUpdateVote = await addressVoteCollection.updateOne(myQuery, newValues);
  } else {
    let resInsertVote = await addressVoteCollection.insertOne(vote);
  }

  // Update the vote count for the selected vote question
  let yesVote = await addressVoteCollection.find({qId: userId, voteState: 1}).toArray();
  let noVote = await addressVoteCollection.find({qId: userId, voteState: 0}).toArray();
  const resUpdate = await adminVoteCollection.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $set: { yesCnt: yesVote.length, noCnt: noVote.length } }
  );
  console.log("update", resUpdate);

  status.success = true;
  res.json(status);
});

app.listen(process.env.PORT, () =>
  console.log("Your app is listening on port " + process.env.PORT)
);

app.addListener("close", async () => {
  console.log("closing connection to the Mongodb...");
  await client.close();
  clearInterval(myInterval);
});
