const express = require('express')
const app = express()
const axios = require('axios')

require('dotenv').config()
require('./cli')

const PORT = 3000

const { HARVEST_CLIENT_ID, HARVELS_CLIENT_SECRET } = process.env

const auth = async () => {
  const request = await axios.get(
    `https://id.getharvest.com/oauth2/authorize?client_id=${HARVEST_CLIENT_ID}&response_type=token`
  )

  console.log(request.data)
  // return await request.data
}

auth()

app.get('/', async (req, res) => {
  console.log('GET: /')
})

app.get('/auth', async (req, res) => {
  console.log('GET: /auth')
})

app.listen(PORT, () => console.log(`Listening on port http://localhost:${PORT}`))
