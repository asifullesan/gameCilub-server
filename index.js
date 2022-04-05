const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const app = express();
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const fileUpload = require('express-fileupload');
const port = process.env.PORT || 5000;



// middleware

app.use(cors());
app.use(express.json());
app.use(fileUpload());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mfooq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });





async function run() {
    try {
        await client.connect();
        const database = client.db('GameClubBD');
        const usersCollection = database.collection('users');
        const teamsCollection = database.collection('teams');
        const reviewCollection = database.collection('reviews');
        const result1Collection = database.collection('result-paid');
        const result2Collection = database.collection('result-paid-two');
        const resultCollection = database.collection('match-result');
        const textCollection = database.collection('text');
        const contactCollection = database.collection('contact');



        // result 1


        app.get('/result-paid', async (req, res) => {
            const cursor = result1Collection.find({});
            const result1 = await cursor.toArray();
            res.send(result1);
        })


        app.post('/result-paid', async (req, res) => {
            const resultPaid1 = req.body;
            const result = await result1Collection.insertOne(resultPaid1)
            res.json(result);
        })

        // result 2


        app.get('/result-paid-two', async (req, res) => {
            const cursor = result2Collection.find({});
            const result2 = await cursor.toArray();
            res.send(result2);
        })


        app.post('/result-paid-two', async (req, res) => {
            const resultPaid2 = req.body;
            const result = await result2Collection.insertOne(resultPaid2)
            res.json(result);
        })



        // text


        app.get('/text', async (req, res) => {
            const cursor = textCollection.find({});
            const text = await cursor.toArray();
            res.send(text);
        })


        app.post('/text', async (req, res) => {
            const text = req.body;
            const result = await textCollection.insertOne(text)
            res.json(result);
        })



        // match result


        app.get('/match-result', async (req, res) => {
            const cursor = resultCollection.find({});
            const result3 = await cursor.toArray();
            res.send(result3);
        })

        app.post('/match-result', async (req, res) => {
            const resultPaid3 = req.body;
            const result = await resultCollection.insertOne(resultPaid3)
            res.json(result);
        })















        // review data

        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        app.post('/reviews', async (req, res) => {
            const reviewItem = req.body;
            const result = await reviewCollection.insertOne(reviewItem)
            res.json(result);
        })





        // review data

        app.get('/contact', async (req, res) => {
            const cursor = contactCollection.find({});
            const contact = await cursor.toArray();
            res.send(contact);
        })

        app.post('/contact', async (req, res) => {
            const contactItem = req.body;
            const result = await contactCollection.insertOne(contactItem)
            res.json(result);
        })







        // users data

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.json(result);
        })

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })


        // teams data

        app.post('/teams', async (req, res) => {
            const scrim = req.body.scrim;
            const teamName = req.body.teamName;
            const teamManagerName = req.body.teamManagerName;
            const teamManagerEmail = req.body.teamManagerEmail;
            const teamManagerDisId = req.body.teamManagerDisId;
            const player1IGN = req.body.player1IGN;
            const player1Id = req.body.player1Id;
            const player2IGN = req.body.player2IGN;
            const player2Id = req.body.player2Id;
            const player3IGN = req.body.player3IGN;
            const player3Id = req.body.player3Id;
            const player4IGN = req.body.player4IGN;
            const player4Id = req.body.player4Id;
            const player5IGN = req.body.player5IGN;
            const player5Id = req.body.player5Id;
            const teamImage = req.files.teamImage;
            const transitionImage = req.files.transitionImage;
            const teamImageData = teamImage.data;
            const encodeTeamImage = teamImageData.toString('base64');
            const teamImageBuffer = Buffer.from(encodeTeamImage, 'base64');
            const transitionImageData = transitionImage.data;
            const encodeTransitionImage = transitionImageData.toString('base64');
            const transitionImageBuffer = Buffer.from(encodeTransitionImage, 'base64');
            const team = {
                scrim,
                teamName,
                teamManagerName,
                teamManagerEmail,
                teamManagerDisId,
                player1IGN,
                player1Id,
                player2IGN,
                player2Id,
                player3IGN,
                player3Id,
                player4IGN,
                player4Id,
                player5IGN,
                player5Id,
                teamImage: teamImageBuffer,
                transitionImage: transitionImageBuffer

            }

            const result = await teamsCollection.insertOne(team);
            res.json(result);
        });

        app.get('/teams', async (req, res) => {
            const cursor = teamsCollection.find({});
            const teams = await cursor.toArray();
            res.json(teams);
        });


        app.delete('/teams/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await teamsCollection.deleteOne(query);
            res.json(result);
        });

        









        // admin data

        // app.put('/users/admin', async (req, res) => {
        //     const user = req.body;
        //     const filter = { email: user.email };
        //     const updateDoc = { $set: { role: 'admin' } };
        //     const result = await usersCollection.updateOne(filter, updateDoc);
        //     res.json(result);
        // })

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })




        //  cart data

        // app.get('/cart', async (req, res) => {
        //     const cursor = cartCollection.find({});
        //     const cart = await cursor.toArray();
        //     res.send(cart);
        // })

        // app.post('/cart', async (req, res) => {
        //     const cartItem = req.body;
        //     const result = await cartCollection.insertOne(cartItem)
        //     res.json(result);
        // })

        // app.delete('/cart/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: (id) };
        //     const result = await cartCollection.deleteOne(query);
        //     res.json(result);
        // })







        // //  order data

        // app.get('/orders', async (req, res) => {
        //     const cursor = ordersCollection.find({});
        //     const orders = await cursor.toArray();
        //     res.send(orders);
        // })

        // app.post('/orders', async (req, res) => {
        //     const ordersItem = req.body;
        //     const result = await ordersCollection.insertOne(ordersItem)
        //     res.json(result);
        // })

        // app.delete('/orders/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: (id) };
        //     const result = await ordersCollection.deleteOne(query);
        //     res.json(result);
        // })





        // Products Data



        // app.get('/products', async (req, res) => {
        //     const cursor = productsCollection.find({});
        //     const products = await cursor.toArray();
        //     res.send(products);
        // })

        // app.get('/products/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const products = await productsCollection.findOne(query);
        //     res.send(products);
        // })


        // app.post('/products', async (req, res) => {
        //     const newProducts = req.body;
        //     const result = await productsCollection.insertOne(newProducts)
        //     res.json(result);
        // })


        // app.delete('/products/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await productsCollection.deleteOne(query);
        //     res.json(result);
        // })





    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('GameClub.BD server')
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});