const express = require('express')
const path = require('path')
const cors = require('cors')
const axios = require('axios')

require('dotenv').config()

const app = express()

app.use(cors())

app.get('/harvestcallback', async (req, res) => {
  const { code } = req.query

  try {
    const response = await axios.post('https://id.getharvest.com/api/v2/oauth2/token', {
      code,
      client_id: process.env.HARVEST_CLIENT_ID,
      client_secret: process.env.HARVEST_CLIENT_SECRET,
      grant_type: 'authorization_code',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const {
      data: { access_tokes, refresh_token, token_type, expires_in }
    } = response

    console.log({ access_tokes, refresh_token, token_type, expires_in })

    res.sendFile(
      `/index.html?access_tokes=${access_tokes}&refresh_token=${refresh_token}&token_type=${token_type}&expires_in=${expires_in}`
    )
  } catch (error) {
    console.log('Error', error)
    res.status(500).json({ error })
  }
})

const port = process.env.PORT || 3001

app.listen(port, err => {
  if (err) throw err
  console.log(`Listening on http://localhost:${port}`)
})
