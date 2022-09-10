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


app.get("/",checkAuthenticated,(req,res)=> res.render("home",{name:req.user.username}))


app.get("/login",checkNotAuthenticated, (req,res)=> {
    res.render("login")
})

app.get("/register",checkNotAuthenticated, (req,res)=> {
    res.render("register")
})

app.post("/login",checkNotAuthenticated, passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect:"/login",
    failureFlash:true
}))

app.post("/register",checkNotAuthenticated, async(req,res)=>{
    try {
        let hashedPass = await bcrypt.hash(req.body.password, 10)
        let user = new User({
            username: req.body.name,
            email: req.body.email,
            password: hashedPass
        })
        user.save().then(user => res.redirect("/login"))
    } catch {
        res.redirect("/register")
    }

})

app.delete("/logout", (req, res) => {
    req.logOut(() => console.log("logged out"))
    res.redirect("/login")
})


function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/login')
    }
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/")
    } else {
        return next()
    }
}
app.listen(port,()=> console.log("listening to port "+port))