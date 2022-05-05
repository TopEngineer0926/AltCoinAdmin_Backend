const { MongoClient } = require("mongodb");
const constants = require("constants");
const readClaimedData = require("./src/readClaimedData");

const client = new MongoClient(
  "mongodb+srv://razor:3D9wKhTr2EaJAA72@mypfpland-backend.7bvtq.mongodb.net/mypfpland?retryWrites=true&w=majority"
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

const refreshData = () => {
  readClaimedData(async (royalFinal) => {
    console.log(" ===== callback is called ====");
    console.log(royalFinal);
    const claimedLandDocuments = royalFinal.land;
    const claimedRoyalDocuments = royalFinal.royal;

    const db = client.db(constants.dbName);

    const claimedLandsCollection = db.collection("claimed_lands");
    const claimedRoyalsCollection = db.collection("royal_lands");

    claimedLandsCollection.remove({});
    claimedRoyalsCollection.remove({});

    await claimedLandsCollection.insertMany(claimedLandDocuments);
    await claimedRoyalsCollection.insertMany(claimedRoyalDocuments);
  });
};

refreshData();
const myInterval = setInterval(refreshData, 300000);
