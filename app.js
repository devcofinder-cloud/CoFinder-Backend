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
app.use('/api/user/question',require('./src/routes/User/questionaire.routes'))
app.use('/api/user/profile-questions',require('./src/routes/User/profileQuestion.routes'))
app.use("/api/conversations",require('./src/routes/User/conversation.routes'));
app.use("/api/messages",require('./src/routes/User/message.routes'));
app.use("/api/posts",require('./src/routes/User/post.routes'));
app.use("/api/dashboard",require('./src/routes/User/userDashboard.routes'));
app.use("/api/professional",require('./src/routes/User/professionalProfile.routes'));
app.use("/api/notification",require('./src/routes/User/notification.routes'));
app.use("/api/profile-count",require('./src/routes/User/profileView.routes'));
app.use("/api/waitlist", require('./src/routes/User/waitList.routes'));



//admin
app.use('/api/admin', require('./src/routes/admin/admin.auth.routes'))
app.use('/api/admin/users', require('./src/routes/admin/user.routes'))
app.use('/api/admin/question', require('./src/routes/admin/questionaire.routes'))
app.use('/api/admin/profile-questions', require('./src/routes/admin/profileQuestions.routes'))
app.use('/api/ai', require('./src/routes/User/ai.routes') );


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