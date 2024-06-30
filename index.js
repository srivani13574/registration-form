const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path"); // Import path module to work with file paths

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;


const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect('mongodb+srv://newuser:srivani13102003@cluster0.f8zcrft.mongodb.net/registrationFormDB',{
    useNewUrlParser : true,
    useUnifiedTopology :true,
});
const registrationSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String,
});
const Registration = mongoose.model("Registration",registrationSchema);
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/pages/index.html")); // Correctly join the path
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await Registration.findOne({ email: email });

        if (!existingUser) {
            const registrationData = new Registration({
                name,
                email,
                password
            });
            await registrationData.save();
            res.redirect("/success");
        } else {
            console.log("User already exists");
            res.redirect("/error");
        }
    } catch (error) {
        console.error("Error during registration:", error);
        res.redirect("/error");
    }
});
app.get("/success",(req,res)=>{
    res.sendFile(path.join(__dirname, "/pages/success.html"));
});

app.get("/error",(req,res)=>{
    res.sendFile(path.join(__dirname, "/pages/error.html"));
});




app.listen(port, () => {
    console.log("Server is running on port ${port}");
});