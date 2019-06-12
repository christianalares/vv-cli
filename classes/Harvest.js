/* inquirer
    .prompt([
      {
        type: 'input',
        name: 'email',
        message: 'Fill in your harvest email account:'
      },
      {
        type: 'password',
        name: 'password',
        message: 'Fill in your harvest password:'
      }
    ])
    .then(({ email, password }) => {
      console.log({ email, password })
    })
    .catch(e => console.log(e))

    const inquirer = require('inquirer')
*/

const express = require('express')
const app = express()
const chalk = require('chalk')
const ora = require('ora')
const axios = require('axios')
require('dotenv').config()

const { HARVEST_CLIENT_ID, HARVEST_CLIENT_SECRET } = process.env
const PORT = 3000

console.log(22, PORT)

class Harvest {
  constructor() {
    this.CLIENT_ID = HARVEST_CLIENT_ID
    this.CLIENT_SECRET = HARVEST_CLIENT_SECRET
    this.code = null
    this.scope = null
    this.spinner = null
    this.credentials = {}
  }

  listen() {
    return new Promise(resolve => {
      app.listen(PORT, () => resolve())
    })
  }

  kill() {
    setInterval(() => {
      console.log(this.credentials)
      process.exit(0)
    }, 2000)
  }

  registerCallback() {
    app.get('/harvestcallback', async (req, res) => {
      this.code = req.query.code
      this.scope = req.query.scope

      this.requestAuth()

      res.send('Thank you, you can now close this tab')
    })
  }

  async requestAuth() {
    this.spinner
      .succeed('Thanks for submitting that form')
      .start('Just gotta fetch some tokens, hold on...')

    try {
      const response = await axios.post('https://id.getharvest.com/api/v2/oauth2/token', {
        code: this.code,
        client_id: this.CLIENT_ID,
        client_secret: this.CLIENT_SECRET,
        grant_type: 'authorization_code',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const { data } = await response
      this.credentials = data

      this.spinner
        .succeed('I got the tokens')
        .start("Authentication went good, we're done here!")
        .succeed()
      this.kill()
    } catch (error) {
      this.spinner.fail(`Sorry, authentication failed: ${error.response.data.error_description}`)
      this.kill()
    }
  }

  help() {
    console.log('Harvest help')
  }

  async auth() {
    const authUrl = `https://id.getharvest.com/oauth2/authorize?client_id=${
      this.CLIENT_ID
    }&response_type=code`
    console.log(chalk.blue('Go to the following URL to authenticate:'))
    console.log(authUrl)

    this.registerCallback()
    await this.listen()
    this.spinner = ora("Yeah, I'll wait...").start()
  }

  resetAuth() {
    console.log('resetting auth')
  }
}

module.exports = Harvest
