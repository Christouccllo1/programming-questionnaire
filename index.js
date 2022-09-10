let express = require("express")
let expressLayouts = require("express-ejs-layouts")
const dotenv = require("dotenv")
dotenv.config({ path: '.env' })
const bcrypt = require('bcrypt')
const User = require('./models/User.js')
const passport = require('passport')
const initializePassport = require('./passport-config')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

initializePassport(passport, User);

let app = express()
let port = process.env.PORT || 5001

app.use(expressLayouts)
app.set("view engine",".ejs")
app.use(express.static(__dirname + "/static"))
app.use(express.urlencoded({extended:false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride("_method"))


const connectDb = require("./database/database.js")

connectDb();


app.get("/",(req,res)=> res.render("home"))
app.get("/login", (req,res)=> {
    res.render("login")
})

app.get("/register", (req,res)=> {
    res.render("register")
})

app.post("/register", (req,res)=>{
    console.log(req.body)
    res.redirect("/login")
})

app.listen(port,()=> console.log("listening to port "+port))