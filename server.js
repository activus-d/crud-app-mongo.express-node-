const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()
const PORT = 3007

MongoClient.connect('mongodb+srv://starwars:nopassword@cluster0.27wpr.mongodb.net/?retryWrites=true&w=majority')
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes')

    app.set('view engine', 'ejs')
    app.use(express.static('public'))
    app.use(bodyParser.urlencoded({extended: true})) 
    app.use(bodyParser.json()) 

    app.get('/', (req, res) => {
        db.collection('quotes').find().toArray()
          .then(quotes => {
            // console.log(quotes)
            res.render('index.ejs', { quotes: quotes })
        })
        .catch(error => console.error(error))
    })
    app.post( '/quotes', (req, res) => {
        quotesCollection.insertOne(req.body)
        .then(result => {
            console.log(result)
            res.redirect('/')
        })
        .catch(error => console.error(error))
    } )
 
    app.put('/quotes', (req, res) => {
        quotesCollection.updateOne(
            { name: 'hi' },
            {
              $set: {
                name: req.body.name,
                quote: req.body.quote
              }
            },
            {
              upsert: true
            }
        )
        .then(result => {
            res.json('Success')
        })
        .catch(error => console.error(error))
    })
    app.delete('/quotes', (req, res) => {
        // Handle delete event here
        quotesCollection.deleteOne(
            { name: 'dark vader' }
        )
        .then(result => {
            if (result.deletedCount === 0) {
              return res.json('No quote to delete')
            }
            res.json(`Deleted Darth Vadar's quote`)
          })
        .catch(error => console.error(error))
    })
})
.catch(console.error)

app.listen(PORT, () => {
    console.log(`${PORT} is running`)
})