let express = require("express")


let app = express()
let port = process.env.PORT || 5001

app.get("/",(req,res)=> res.send("hello, this is home page"))




app.listen(port,()=> console.log("listening to port "+port))