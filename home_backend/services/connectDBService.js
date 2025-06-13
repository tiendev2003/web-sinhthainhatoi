const mongoose = require("mongoose");

async function connectDatabase() {
    const uri = `mongodb+srv://booking:booking@cluster0.4cjnhul.mongodb.net/`;
    try {
        // await mongoose.connect(`mongodb://127.0.0.1:${process.env.PORT_MONGO}/${process.env.DATABASE_NAME}`);
        await mongoose.connect(uri);
        console.log("Connect succesfully!");
    } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
    }
}

module.exports = connectDatabase;
