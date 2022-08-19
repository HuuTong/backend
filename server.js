const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const dbConnect = require("./config/db/dbConnect");
const { userRegisterCtrl } = require("./controllers/users/authControllers");
const User = require("./model/user/User");
const { errorHandle, notFound } = require("./middlewares/errorHandle");
const app = express();

//db
dbConnect();
//middleware
app.use(express.json());

//customer middleware
const logger = (req, res, next) => {
  next();
};

app.use(logger);

// Routes
require("./router/routes")(app);

app.get("/", (req, res) => {
    res.send("Hello Blog Service!!!!");
});
// err handle
app.use(notFound);
app.use(errorHandle);

// server
const PORT = process.env.PORT || 5000;
app.listen(5000, console.log(`Server start port: ${PORT}`));
