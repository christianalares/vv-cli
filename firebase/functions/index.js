const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors({ origin: true }))

app.get('/testing/:value', (req, res) => {
  res.status(200).send({ testingData: true, value: req.params.value })
})

exports.api = functions.https.onRequest(app)