const mongoose = require("mongoose");
const { DbConfig } = require("./config");

(async () => {
    try {
        await mongoose.connect(DbConfig.mongoDBUrl, {
            dbName: DbConfig.mongoDBName,
            autoCreate: true,
            autoIndex: true,
        })
        console.log("Mongodb Connected Successfully.");
        console.log(`Connected to MongoDB: ${DbConfig.mongoDBName}`);
        
    } catch (exception) {
        console.log("Error connecting to MongoDB", exception);
        process.exit(1);
    }
})();