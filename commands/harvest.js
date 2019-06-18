const Harvest = require('../classes/Harvest')

const harvest = new Harvest()

const cmd = {
  version: 1,
  '--help': {
    _cmd: () => harvest.help()
  },
  '-h': {
    _cmd: () => harvest.help()
  },
  auth: {
    _cmd: () => harvest.auth(),
    reset: {
      _cmd: () => harvest.resetAuth()
    }
  },
  unauth: {
    _cmd: () => harvest.unAuth(),
  },
  whoami: {
    _cmd: () => harvest.whoami(),
  },
  accounts: {
    _cmd: () => harvest.accountsHelp(),
    ls: {
      _cmd: () => harvest.accountsList()
    },
    list: {
      _cmd: () => harvest.accountsList()
    },
    set: {
      _cmd: () => harvest.accountsSet()
    }
  }

}
module.exports = cmd
