const config = require('../config')

const registerCommands = commands => {
  const obj = {}
  const showVersion = cmd => console.log(`${cmd} version: ${obj[cmd].version}`)

  commands.forEach(command => {
    obj[command] = {
      ...require(`${config.COMMANDS_FOLDER}/${command}`),
      '--version': {
        _cmd: () => showVersion(command)
      },
      '-v': {
        _cmd: () => showVersion(command)
      }
    }
  })

  return obj
}

module.exports = registerCommands
