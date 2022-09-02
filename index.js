let express = require("express")
let expressLayouts = require("express-ejs-layouts")

let app = express()
let port = process.env.PORT || 5001

app.use(expressLayouts)
app.set("view engine",".ejs")
app.get("/",(req,res)=> res.render("home"))




app.listen(port,()=> console.log("listening to port "+port))