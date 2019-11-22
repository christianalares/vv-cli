const hello = () => {
  console.log(`
    👋 Hello!
  `)
}

const help = () => {
  console.log('There is nothing to help with...?')
}

const cmd = {
  version: 1,
  _cmd: hello,
  '--help': {
    _cmd: help
  },
  '-h': {
    _cmd: help
  }
}
module.exports = cmd
