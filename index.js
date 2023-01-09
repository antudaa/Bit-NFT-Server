const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p4iytrv.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {

        const membershipRequestCollection = client.db('NFTCollection').collection('membershipRequestCollection');
        const memberCollection = client.db('NFTCollection').collection('memberCollection');
        const blogsCollection = client.db('NFTCollection').collection('blogsCollection');
        const approvedBlogsCollection = client.db('NFTCollection').collection('approvedBlogsCollection');


        app.get('/membershipRequest', async (req, res) => {
            const query = {};
            const request = await membershipRequestCollection.find(query).toArray();
            res.send(request);
        });

        app.post('/membershipRequest', async (req, res) => {
            const newRequest = req.body;
            const result = await membershipRequestCollection.insertOne(newRequest);
            res.send(result);
        });

        // Delete Request 
        app.delete('/membershipRequest/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await membershipRequestCollection.deleteOne(query);
            res.send(result);
        });

        // Adding member in memberCollection with post method
        app.patch('/members/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const option = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: req.body.name,
                    email: req.body.email,
                    purpose: req.body.purpose,
                    profilePhoto: req.body.profilePhoto,
                    userId: req.body.userId,
                    status: 'Member'
                }
            }
            const newMember = await memberCollection.updateOne(query, updatedDoc, option);
            res.send(newMember);
        });


        // Getting members.
        app.get('/membersList/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const request = await memberCollection.findOne(query);
            res.send(request);
        });


        // Getting All the Members 
        app.get('/allMembers', async (req, res) => {
            const query = {};
            const request = await memberCollection.find(query).toArray();
            res.send(request);
        });


        // Delete A Member
        app.delete('/allMembers/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await memberCollection.deleteOne(query);
            res.send(result);
        });


        // Posting Blog 
        app.post('/postBlog', async (req, res) => {
            const post = req.body;
            const result = await blogsCollection.insertOne(post);
            res.send(result);
        });


        // Getting Requested Blogs.
        app.get('/postBlog', async (req, res) => {
            const query = {};
            const request = await blogsCollection.find(query).toArray();
            res.send(request);
        });


        // Deleting Declined Blog Request 
        app.delete('/postBlog/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await blogsCollection.deleteOne(query);
            res.send(result);
        });


        // Sending Approved Post's to Approved Blog Collection
        app.post('/approvedBlogs', async (req, res) => {
            const post = req.body;
            const sendPost = await approvedBlogsCollection.insertOne(post);
            res.send(sendPost);
        });

        // Getting Approved Posts
        app.get('/approvedBlogs', async (req, res) => {
            const query = {};
            const post = await approvedBlogsCollection.find(query).toArray();
            res.send(post);
        });


        app.get('/approvedBlogs/:email', async (req, res) => {
            const email = req.params.email;
            const query = { authorEmail: email };
            const request = await approvedBlogsCollection.find(query).toArray();
            res.send(request);
        });



    }
    finally {

    }
}

run().catch(console.log);



app.get('/', async (req, res) => {
    res.send(`NFT Collection website Running`);
})


app.listen(port, () => console.log(`Server is running on port ${port}`))