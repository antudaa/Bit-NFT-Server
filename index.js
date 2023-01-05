const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p4iytrv.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {

        const membershipRequestCollection = client.db('NFTCollection').collection('membershipRequestCollection');


        app.get('/membershipRequest', async (req, res) => {
            const query = {};
            const request = await membershipRequestCollection.find(query).toArray();
            res.send(request);
        })

        app.post('/membershipRequest', async (req, res) => {
            const newRequest = req.body;
            const result = await membershipRequestCollection.insertOne(newRequest);
            res.send(result);
        })
    }
    finally {

    }
}

run().catch(console.log);



app.get('/', async (req, res) => {
    res.send(`NFT Collection website Running`);
})


app.listen(port, () => console.log(`Server is running on port ${port}`))