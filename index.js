const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dvdk4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const port = 5000

const app = express()

app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
    res.send('Creative Agency Server is Working and connected with database!')
})

const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true });
client.connect(err => {
  const servicesCollection  = client.db("creativeAgency").collection("services");
  const orderCollection  = client.db("creativeAgency").collection("orders");
  const reviewCollection  = client.db("creativeAgency").collection("reviews");

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    console.log(order);
    orderCollection.insertOne(order)
        .then((result) => {
            res.send(result.insertedCount > 0)
        })
    })

    app.post('/addReview', (req, res) => {
        const review = req.body;
        console.log(review);
        reviewCollection.insertOne(review)
            .then((result) => {
                res.send(result.insertedCount > 0)
            })
    })

    app.post('/addService', (req, res) => {
        const service = req.body;
        console.log(service);
        servicesCollection.insertOne(service)
            .then((result) => {
                res.send(result.insertedCount > 0)
            })

    })

    app.get('/getServices', (req, res) => {
        servicesCollection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })

});

app.listen(process.env.PORT || port, console.log('Database Running on Port', port))