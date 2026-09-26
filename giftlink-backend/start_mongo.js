const { MongoMemoryServer } = require('mongodb-memory-server');

async function main() {
    console.log("Starting MongoDB Memory Server...");
    const mongod = await MongoMemoryServer.create({
        instance: {
            port: 27017,
            dbName: 'giftdb'
        }
    });
    const uri = mongod.getUri();
    console.log(`MongoDB Server started at ${uri}`);
    process.env.MONGO_URL = 'mongodb://127.0.0.1:27017';

    // Requiring index.js automatically executes loadData() once
    console.log("MongoDB import command:");
    console.log("node util/import-mongo/index.js");
    require('./util/import-mongo/index.js');
}

main().catch(err => {
    console.error("Error starting MongoDB:", err);
    process.exit(1);
});
