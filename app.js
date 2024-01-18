const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config({path:'./.env'})
const web = require('./routes/web')
const connectdb = require('./db/connectdb')
const fileupload = require("express-fileupload");
const cookieParser = require('cookie-parser')
const cors = require('cors')


app.use(cors()) // for api communication

app.use(cookieParser()) // for getting token in auth

//for file upload
app.use(fileupload({useTempFiles: true}));

//for dataget in api
app.use(express.json())  

connectdb()

//load route
app.use('/api-eshopper',web)
//localhost:5000/api




// server create
app.listen(process.env.PORT,()=>{
    console.log(`server running on localhost: ${process.env.PORT}`);
})
