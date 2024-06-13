const express = require('express');
const app = express();
const mongoose = require("mongoose")
const userRoute = require("./api/routes/user")
const bodyParser = require('body-parser');
const paymentroute=require('./api/routes/payment')
const cors = require('cors');


mongoose.connect('mongodb+srv://dourbinaval:Naval@cluster0.a3llmdv.mongodb.net/')
mongoose.connection.on('error',err=>{
    console.log(err);
    console.log("connection failed");
})
mongoose.connection.on('connected',connected=>{
    console.log("connected")
}
)
const corsOptions = {
    origin: 'https://eco-lac.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/user',userRoute)
app.use('/payment',paymentroute)


app.use((req,res,next) => {
    res.status(404).json({
        error:'bad request'
    })
})

module.exports =  app;
