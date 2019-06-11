const inquirer = require('inquirer')

const help = () => {
  console.log('Harvest help')
}

const auth = () => {
  console.log('auth')
  inquirer
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
}

const resetAuth = () => {
  console.log('resetting auth')
}

const cmd = {
  version: 1,
  '--help': {
    _cmd: help
  },
  auth: {
    _cmd: auth,
    reset: {
      _cmd: resetAuth
    }
  }
}
module.exports = cmd
