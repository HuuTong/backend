const mongoose = require('mongoose');

console.log('url', process.env.MONGO_URL);
const dbConnect = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            // useCreateIndex: true,
            // useFindAndModify: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("DB is connect successful");
    } catch (error) {
        console.log(`Errror ${error.message}`)   
    }
};

module.exports = dbConnect;