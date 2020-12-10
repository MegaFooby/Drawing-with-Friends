require('rootpath')();
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const config = require('config.json');
const bodyParser = require('body-parser');
const jwt = require('helpers/jwt');
const errorHandler = require('helpers/error-handler');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(jwt()); // auth for current logged in user
 
app.get('/', (req, res) => {            // Home request
    res.json({
        message: 'Drawing with friends!'
    });
});

app.use('/users', require('./users/users.controller'));     // Users api endpoints
app.use('/rooms', require('./rooms/rooms.controller'));     // Rooms api endpoints

app.use(errorHandler);
 
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});

async function main() {

    const db = new MongoClient(config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true} );

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