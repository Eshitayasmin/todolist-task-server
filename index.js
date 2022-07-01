const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
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
    

        app.get('/todo', async (req, res) => {
            const todos = await todoCollection.find().toArray();
            res.send(todos);
        })

       
        app.post('/todo', async (req, res) => {
            const todo = req.body;
            const result = await todoCollection.insertOne(todo);
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