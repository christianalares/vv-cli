const express = require('express')
const app = express()
const axios = require('axios')

require('dotenv').config()
require('./cli')

const PORT = 3000

const { HARVEST_CLIENT_ID, HARVELS_CLIENT_SECRET } = process.env

const getIt = async () => {
	const request = await axios.get(
		`https://id.getharvest.com/oauth2/authorize?client_id=${HARVEST_CLIENT_ID}&response_type=token`
	)
	return await request.data
}

// getIt()

app.get('/', async (req, res) => {
	const a = await getIt()
	console.log(a)
})

app.get('/auth', async (req, res) => {
	console.log(req)
})

app.listen(PORT, () => console.log(`Listening on port http://localhost:${PORT}`))
