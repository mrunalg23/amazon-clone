const functions = require("firebase-functions");
 
const express = require("express");

const cors =require("cors");

const stripe = require ("stripe")('sk_test_51JZKTnSJIeWVovsOyrjRHpO683QAW1dSORPqe5sda0NUzsKCmwm7cyVkwDaralyUbJPaZaZsgQEgAUtBHIW0L4qu00HViTTyap')
//API

//app config
const app = express();
//Middlewares
app.use(cors({origin:true}));
app.use(express.json());

//Api routes
app.get('/',(request,response) => response.status(200).send('hello world!'))
app.post('/payments/create',async (request,response) =>{
    const total = request.query.total;
    console.log('Payment Request received BOOM!!! for this amount >>>',total)
    
    const paymentIntent = await stripe.paymentIntents.create({
        amount:total,//subunits of the currency
        currency:"inr",
    });
 response.status(201).send({     //everything ok
   clientSecret: paymentIntent.client_se

 })
})
//Listen command
exports.api = functions.https.onRequest(app)




//example endpoint
//http://localhost:5001/challenge-4c39c/us-central1/api*/