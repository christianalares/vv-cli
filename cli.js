const config = require('./config')
const getCommands = require('./helpers/getCommands')
const registerCommands = require('./helpers/registerCommands')
const { hasPath, path } = require('ramda')

const { vvDirExists, createVVDir, checkCommandConfigFiles } = require('./helpers/vvDir')

const checkFileSystem = commands => {
  if (!vvDirExists()) {
    createVVDir()
  }
  checkCommandConfigFiles(commands)
}

getCommands(config.COMMANDS_FOLDER).then(commands => {
  checkFileSystem(commands)
  const registeredCommands = registerCommands(commands)
  const input = process.argv.filter(arg => !arg.includes('/'))
  const [baseCommand, ...rest] = input
  const foundCommand = registeredCommands[baseCommand]

  if (hasPath(rest, foundCommand)) {
    path(rest, foundCommand)['_cmd']()
  } else {
    console.log(`Invalid command: ${rest.join(' ')}`)
  }
})
