const express = require('express')
const app = express()
const inquirer = require('inquirer')
const chalk = require('chalk')
const ora = require('ora')
const axios = require('axios')
const table = require('text-table')
const config = require('../config')
const { updateCommandFile, readCommandFile } = require('../helpers/vvDir')
require('dotenv').config()

const { HARVEST_CLIENT_SECRET } = process.env
const HARVEST_CLIENT_ID = 'Zh4LGEEj1eXX61kayE65edg5'
const PORT = 1987

// function strlen(str) {
//   return str.replace(/\u001b[^m]*m/g, '').length
// }

class Harvest {
  constructor() {
    this.commandName = 'harvest'
    this.CLIENT_ID = HARVEST_CLIENT_ID
    this.CLIENT_SECRET = HARVEST_CLIENT_SECRET
    this.code = null
    this.credentials = null
    this.spinner = null
    this.user = null
    this.accounts = null
    this.chosenAccount = null
  }

  _listen() {
    return new Promise(resolve => {
      app.listen(PORT, () => resolve())
    })
  }

  _errorOut(message, responseErrorMessage = '') {
    if (!this.spinner) {
      this.spinner = ora({
        text: message,
        indent: 1
      })
        .start()
        .fail()
    } else {
      this.spinner.fail(`${message}: ${responseErrorMessage}`)
    }
    this._kill()
  }

  _kill() {
    process.exit(0)
  }

  _registerCallback() {
    app.get('/harvestcallback', (req, res) => {
      this.code = req.query.code

      console.log(111, req.query)

      setTimeout(() => {
        this._requestAuth()
      }, 2000)

      res.send('Thank you, you can now close this tab')
    })
  }

  async _getAccounts() {
    try {
      const {
        data: { user, accounts }
      } = await axios.get('https://id.getharvest.com/api/v2/accounts', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.credentials.access_token}`
        }
      })

      return {
        user,
        accounts
      }
    } catch (error) {
      console.log('_getAccounts', error)
      // this._errorOut('Could not get user', error.response.data.error_description)
    }
  }

  async _requestAuth() {
    this.spinner
      .succeed('Thanks for submitting that form')
      .start('Just gotta fetch some tokens, hold on...')

    try {
      const { data: credentials } = await axios.post(
        'https://id.getharvest.com/api/v2/oauth2/token',
        {
          code: this.code,
          client_id: this.CLIENT_ID,
          client_secret: this.CLIENT_SECRET,
          grant_type: 'authorization_code',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      this.credentials = credentials

      this.spinner
        .succeed('I got the tokens')
        .start("Authentication went good, we're done here!")
        .succeed()

      const { user, accounts } = await this._getAccounts()

      updateCommandFile(this.commandName, {
        credentials,
        user,
        accounts
      })

      console.log(chalk.bold('Account and user data has been added'))
      this._kill()
    } catch (error) {
      console.log('_requestAuth', error)
      // this._errorOut('Sorry, authentication failed', error.response.data.error_description)
    }
  }

  help() {
    console.log(`
    ${chalk.bold(`vv harvest`)} <command>

      ${chalk.dim('Commands:')}

        auth              Authenticate your self to harvest
        accounts          Lists your harvest accounts
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

  accountsNoCommand() {
    console.log(`Invalid command, run ${chalk.bold('vv harvest accounts --help')} for more info`)
  }

  accountsHelp() {
    console.log('accountsHelp')
  }

  accountsList() {
    const accounts = readCommandFile(this.commandName).accounts
    if (!accounts) {
      this._errorOut("You don't seem to have any accounts on your user")
    }

    // prettier-ignore
    console.log(
      `\n${table(
        [
          ['name', 'product', '# id'].map(s => chalk.dim(s)),
          ...accounts.map(acc => [acc.name, acc.product, acc.id])
        ],
        {
          align: ['l', 'l', 'r'],
          hsep: ' '.repeat(8),
          stringLength: (str) => str.replace(/\u001b[^m]*m/g, '').length
        }
      ).replace(/^/gm, '  ')}`
    )
  }

  async accountsSet() {
    const accounts = readCommandFile(this.commandName).accounts

    if (typeof accounts === 'undefined') {
      console.log(chalk.bold('Could not find any accounts on your user'))
      this._kill()
    }

    if (accounts.length === 0) {
      console.log(chalk.bold("You don't seem to have any accounts on your user"))
      this._kill()
    }

    if (accounts.length === 1) {
      console.log(`
  You only have one account. Setting ${chalk.yellow(accounts[0].name)} to chosen account.
  Type ${chalk.bold('vv harvest accounts ls')} for more details about that account.`)

      updateCommandFile(this.commandName, {
        chosenAccount: accounts[0]
      })

      this._kill()
    }

    try {
      const answer = await inquirer.prompt([
        {
          type: 'list',
          name: 'chosenAccount',
          message: 'Which account do you want to use?',
          choices: accounts.map(account => account.name)
        }
      ])

      const chosenAccount = accounts.find(a => a.name === answer.chosenAccount)

      console.log(`
  ${chalk.yellow(chosenAccount.name)} has been set to chosen account.
  Type ${chalk.bold('vv harvest accounts ls')} for more details about your accounts.`)

      updateCommandFile(this.commandName, {
        chosenAccount
      })
    } catch (error) {
      console.log(error)
      this._errorOut('Failed to choose account', error)
    }
  }
}

module.exports = Harvest
