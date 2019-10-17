const express = require("express")
const app = express()
const session = require("express-session")
const bodyParser = require("body-parser")

const accountRouter = require("./routes/account")

const PORT = 3000



app.use(express.static("public"))
app.use(session({
    secret: "This wasn't Yuno's first rodeo, was it?",
    resave: false,
    saveUninitialized: true
}))
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "pug")

app.get("/", (req, res) => {
    res.render("index")
})

app.use("/account", accountRouter)

app.listen(PORT, () => {
    console.log(`Server Active on Port: ${PORT}`)
})