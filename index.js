const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS }@cluster0.vzamf0d.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        await client.connect();
        const todoCollection = client.db('todo-list-task').collection('todos');
        const completedCollection = client.db('todo-list-task').collection('completed');
    

        app.get('/todo', async (req, res) => {
            const todos = await todoCollection.find().toArray();
            res.send(todos);
        })
        app.get('/complete', async (req, res) => {
            const completed = await completedCollection.find().toArray();
            res.send(completed);
        })

       
        app.post('/todo', async (req, res) => {
            const todo = req.body;
            const result = await todoCollection.insertOne(todo);
            res.send(result);
        })
        app.post('/complete', async (req, res) => {
            const completeTask = req.body;
            const result = await completedCollection.insertOne(completeTask);
            res.send(result);
        })

        app.put('/todo/:id', async (req, res) => {
            const id = (req.params.id).toString();
            const updatedItem = req.body;
            const filter = {_id: ObjectId(id)};
            const updateDoc = {
                $set: {
                    task: updatedItem.task
                },
            };
            const result = await todoCollection.updateOne(filter, updateDoc);
            res.send(result);

        })

        app.delete('/todo/:id', async (req, res) => {
            const id = (req.params.id).toString();
            console.log("deleted id", id);
            const filter = {_id: new ObjectId(id)};
            const result = await todoCollection.deleteOne({_id: ObjectId(id)});
            res.send(result);

        })
     
    }

    finally { }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Endgame task app running');
})

app.listen(port, () => {
    console.log('Endgame task app running in', port);
})