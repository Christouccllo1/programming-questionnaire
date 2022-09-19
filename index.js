let express = require("express")
let expressLayouts = require("express-ejs-layouts")
const bcrypt = require('bcrypt')
const User = require('./models/User.js')
const Question = require("./models/Question")
const passport = require('passport')
const initializePassport = require('./passport-config')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const dotenv = require("dotenv")
dotenv.config({ path: '.env' })


initializePassport(passport, User);



let app = express()
let port = process.env.PORT || 5001

app.use(expressLayouts)
app.set("view engine", ".ejs")
app.use(express.static(__dirname + "/static"))
app.use(express.urlencoded({ extended: false }))
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


app.get("/", checkAuthenticated, async(req, res) => {
    let questions = await Question.find()
    res.render("home", { name: req.user.username, email: req.user.email, questions: questions })

})
app.get("/login", checkNotAuthenticated, (req, res) => {
    res.render("login")
})

app.get("/register", checkNotAuthenticated, (req, res) => {
    res.render("register")
})

app.get("/:id", checkAuthenticated, async(req, res) => {
    try {
        let questions = await Question.find({ category: req.params.id })
        return res.render("home", { name: req.user.username, email: req.user.email, questions: questions })
    }
catch{
    return res.redirect("/")
}
    
})


app.post("/login", checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.post("/register", checkNotAuthenticated, async(req, res) => {
    try {
        let hashedPass = await bcrypt.hash(req.body.password, 10)
        let user = new User({
            username: req.body.name,
            email: req.body.email,
            password: hashedPass
        })
        user.save().then(user => res.redirect("/login"))
    } catch {
        return res.redirect("/register")
    }
})


app.post("/question", checkAuthenticated, async(req, res) => {
    let quest = new Question({
        question: req.body.quest,
        Answer: req.body.ans,
        category: req.body.category,
        username: req.body.user
    })
    quest.save().then(que => { res.redirect("/") })

})

app.get("/deletequest/:id", checkAuthenticated, async(req, res) => {
    try {
        let getQeust = await Question.findById(req.params.id)
        if (req.user.email === getQeust.username) {
            Question.findByIdAndDelete(getQeust.id).then(ress => res.redirect("/"))
        } else {
            return res.render("error", { message: "Cannot be deleted by you", name: req.user.name })
        }
    } catch {
        return res.redirect("/")
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



app.listen(port, () => console.log("listening to port " + port))
