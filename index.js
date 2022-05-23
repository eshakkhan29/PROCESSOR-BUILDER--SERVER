const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1clxv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        await client.connect();
        const partsCollection = client.db("processor").collection("details");
        const ordersCollection = client.db("orders").collection("details");

        //  all parts get
        app.get('/parts', async (req, res) => {
            const parts = await partsCollection.find().toArray();
            res.send(parts);
        })
        // parts get by id
        app.get('/purchase/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await partsCollection.findOne(query);
            res.send(result);
        })

        // post orders
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.send(result);
        })

        // // test 
        // app.post('/data', async (req, res) => {
        //     const data = req.body;
        //     // const result = await usersCollection.insertOne(data);
        //     res.send(result);
        // })
        // // get test
        // app.get('/data', async (req, res) => {
        //     const result = await usersCollection.find().toArray();
        //     res.send(result);
        // })

    }
    finally {
    }
}
run()

app.get('/', (req, res) => {
    res.send(`working the server ${process.env.DB_USER}`)
})
app.listen(port, () => {
    console.log('running this server');
})