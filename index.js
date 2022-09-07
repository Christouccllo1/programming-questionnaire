let express = require("express")
let expressLayouts = require("express-ejs-layouts")

let app = express()
let port = process.env.PORT || 5001

app.use(expressLayouts)
app.set("view engine",".ejs")
app.use(express.static(__dirname + "/static"))
app.use(express.urlencoded({extended:false}))




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