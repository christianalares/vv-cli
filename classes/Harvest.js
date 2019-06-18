const express = require('express')
const app = express()
const inquirer = require('inquirer')
const chalk = require('chalk')
const ora = require('ora')
const axios = require('axios')
require('dotenv').config()

const { HARVEST_CLIENT_ID, HARVEST_CLIENT_SECRET } = process.env
const PORT = 1987

class Harvest {
  constructor() {
    this.CLIENT_ID = HARVEST_CLIENT_ID
    this.CLIENT_SECRET = HARVEST_CLIENT_SECRET
    this.code = null
    this.scope = null
    this.spinner = null
    this.credentials = {}
    this.user = null
    this.accounts = null
    this.chosenAccount = null
  }

  _listen() {
    return new Promise(resolve => {
      app.listen(PORT, () => resolve())
    })
  }

  _errorOut(message, responseErrorMessage) {
    this.spinner.fail(`${message}: ${responseErrorMessage}`)
    this._kill()
  }

  _kill() {
    process.exit(0)
  }

  _registerCallback() {
    app.get('/harvestcallback', (req, res) => {
      this.code = req.query.code
      this.scope = req.query.scope

      setTimeout(() => {
        this._requestAuth()
      }, 2000)

      res.send('Thank you, you can now close this tab')
    })
  }

  async _getAccounts() {
    try {
      const { data: { user, accounts } } = await axios.get('https://id.getharvest.com/api/v2/accounts', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.credentials.access_token}`
        }
      })
  
      return {
        user,
        accounts
      }
    } catch(error) {
      this._errorOut('Could not get user', error.response.data.error_description)
    }
  }

  async _requestAuth() {
    this.spinner
      .succeed('Thanks for submitting that form')
      .start('Just gotta fetch some tokens, hold on...')

    try {
      const { data } = await axios.post('https://id.getharvest.com/api/v2/oauth2/token', {
        code: this.code,
        client_id: this.CLIENT_ID,
        client_secret: this.CLIENT_SECRET,
        grant_type: 'authorization_code',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      this.credentials = data

      this.spinner
        .succeed('I got the tokens')
        .start("Authentication went good, we're done here!")
        .succeed()

      const { user, accounts } = await this._getAccounts()
      this.user = user
      this.accounts = accounts

      console.log('Account data has been added:')
      console.log(this.accounts)
      this._kill()
    } catch (error) {
      this._errorOut('Sorry, authentication failed', error.response.data.error_description)
    }
  }

  help() {
    console.log(`
    ${chalk.bold(`vv harvest`)} <command>

      ${chalk.dim('Commands:')}

        auth              Authenticate your self to harvest
        ls, list          Lists your harvest projects

      
      ${chalk.dim('Options:')}

        -h, --help        Prints this dialog
    `)
  }

  async auth() {
    const authUrl = `https://id.getharvest.com/oauth2/authorize?client_id=${
      this.CLIENT_ID
    }&response_type=code`
    console.log(chalk.blue('Go to the following URL to authenticate:'))
    console.log(authUrl)

    this._registerCallback()
    await this._listen()
    this.spinner = ora({
      text: "I'll just wait here...",
      indent: 1
    }).start()
  }

  unAuth() {
    console.log('unauth!')
  }

  accountsHelp() {
    console.log('accountsHelp')
  }

  accountsList() {
    console.log(this.accounts)
  }

  async accountsSet() {
    try {
      const answer = await inquirer
        .prompt([
          {
            type: 'list',
            name: 'chosenCccount',
            message: 'Which account do you want to use?',
            choices: accounts.map(account => account.name),
          }
        ])

        this.chosenAccount = accounts.find(a => a.name === answer.chosenCccount)
    } catch(error) {
      this._errorOut('Failed to choose account', error)
    }
  }
}

module.exports = Harvest
