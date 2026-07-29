require("dotenv").config();

const app = require("./app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

app.get('/',(req,res)=>{
    res.send("Jai Shree Ram")
})

connectDB();
app.listen(PORT,()=>{
    console.log(`Server running at ${PORT}`)
})