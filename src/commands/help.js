const help = () => console.log('helping...')

const cmd = {
  version: 1,
  '--help': {
    _cmd: help
  }
}
module.exports = cmd
