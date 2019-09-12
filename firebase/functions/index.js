const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express()

app.use(cors({ origin: true }))

app.get('/testing/:value', (req, res) => {
  res.status(200).send({ testingData: true, value: req.params.value })
})

app.get('/harvestcallback', async (req, res) => {
  const { code } = req.query

  try {
    const { client_id, client_secret } = functions.config().harvest

    console.log('code:', code)
    console.log('client_id:', client_id)
    console.log('client_secret:', client_secret)

    const response = await axios.post('https://id.getharvest.com/api/v2/oauth2/token', {
      code,
      client_id,
      client_secret,
      grant_type: 'authorization_code',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log('response:', response)
    res.status(200).send(data)
  } catch (error) {
    console.log('Could not authenticate:', error)
    res.status(500).send({ error })
  }
})

console.log(functions)

exports.api = functions.https.onRequest(app)
