const express = require('express')
const app = express()
const port = 5001

const {mongoose} = require('mongoose')
const {MONGOURL} = require('./secret.js')

require('./models/user')
require('./models/post')

mongoose.connect(MONGOURL)

// for true value
mongoose.connection.on("connected", ()=> {console.log("Connected to MongoDB")})

// for false value
mongoose.connection.on("error", (err)=> {console.log("Error connecting to MongoDB", err)})

app.use(express.json())
app.use(require("./routes/auth"))
app.use(require("./routes/post"))

// const customMiddleware=(req, res, next)=>{
//     console.log("Hello, I m a middleware")
//     next()
// }

// app.use(customMiddleware);          // Firstly, custommiddleware is running and then apis is running

app.get('/', (req, res) => {res.send("Home Page")})


// app.get('/blog/', (req, res) =>{res.send("Blog Page")})


app.listen(port, ()=>{console.log(`server is running at port ${port}`)})

