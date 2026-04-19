require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const api = require('./api')
const middleware = require('./middleware')
const bodyParser = require('body-parser')

// Set the port
const port = process.env.PORT || 3000
const mongoUri = process.env.MONGO_URI

if (!mongoUri) {
  console.error('Missing MONGO_URI in .env file')
  process.exit(1)
}

// Boot the app
const app = express()
// Register the public directory
app.use(express.static(__dirname + '/public'))
// register the routes
app.use(bodyParser.json())
app.use(middleware.cors)
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.put('/products/:id', api.editProduct)
app.delete('/products/:id', api.deleteProduct)
app.post('/products', api.createProduct)

// Connect to MongoDB and start the server
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err)
})

mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 5000,
})
  .then(() => {
    console.log('Database connected')
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message || err)
    console.warn('Starting Express server without MongoDB connection')
  })
  .finally(() => {
    app.listen(port, () => console.log(`Server listening on port ${port}`))
  })

