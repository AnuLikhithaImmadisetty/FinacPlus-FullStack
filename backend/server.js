const app = require("./app");
const connectDB = require('./config/db')

app.listen(process.env.PORT, () => {
    connectDB()
    console.log(`server is working on PORT:${process.env.PORT}`)
    console.log(new Date())
})