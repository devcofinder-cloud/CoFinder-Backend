const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
// const cookieParser = require("cookie-parser");

const errorHandler = require("./src/middlewares/error.middleware");


const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(cookieParser());   baad me 


app.use('/api/user',require('./src/routes/User/auth.routes'))
app.use('/api/user',require('./src/routes/User/questionaire.routes'))


//admin
app.use('/api/admin', require('./src/routes/admin/admin.auth.routes'))
app.use('/api/admin/question', require('./src/routes/admin/questionaire.routes'))



app.get('/',(req,res)=>{
    res.send("Jai Shree Ram")
})



// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found"
    });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;