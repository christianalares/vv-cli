const Harvest = require('../classes/Harvest')

const harvest = new Harvest()

const cmd = {
  version: 1,
  '--help': {
    _cmd: harvest.help
  },
  auth: {
    _cmd: () => harvest.auth(),
    reset: {
      _cmd: () => harvest.resetAuth()
    }
  }
}
module.exports = cmd
