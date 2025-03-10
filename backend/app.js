const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const allUserRoutes = require('./routes/user.route');
const {errorMiddleware} = require('./middlewares/Error.middleware');

const app = express();

app.use(express.json());

dotenv.config({
    path : './.env'
})

app.use(cors({
    origin : [process.env.LOCAL_URI, process.env.PRODUCTION_URI],
    methods : ["GET", "POST", "PUT", "DELETE"]
}))

app.use('/api/v1/user', allUserRoutes);

app.use(errorMiddleware);

module.exports = app;