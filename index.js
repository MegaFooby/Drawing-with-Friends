const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
 
app.get('/', (req, res) => {
    res.json({
        message: 'Drawing with friends!'
    });
});
 
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});

async function main() {

    const connectionURL = 'mongodb+srv://admin:admin@drawingwithfriendsclust.1dxgm.mongodb.net/DrawingWithFriends_DB?retryWrites=true&w=majority';
    const db = new MongoClient(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true} );

    try {
        // Connect to the MongoDB cluster
        await db.connect();

        // Make the appropriate DB calls
        await listDatabases(db);

    } catch (e) {
        console.error(e);
    } finally {
        // Close the connection to the MongoDB cluster
        await db.close();
    }
}

main().catch(console.error);


//simple connection verification function. Prints existing databases to console
async function listDatabases(db) {
    databasesList = await db.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};