let express = require("express")
let expressLayouts = require("express-ejs-layouts")

let app = express()
let port = process.env.PORT || 5001

app.use(expressLayouts)
app.set("view engine",".ejs")
app.get("/",(req,res)=> res.render("home"))
app.get("/login", (req,res)=> {
    res.render("login")
})

app.get("/register", (req,res)=> {
    res.render("register")
})



app.listen(port,()=> console.log("listening to port "+port))