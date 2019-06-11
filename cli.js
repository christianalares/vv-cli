const getCommands = require('./helpers/getCommands')
const registerCommands = require('./helpers/registerCommands')
const { hasPath, path } = require('ramda')
const commandsFolder = './commands/'

getCommands(commandsFolder).then(commands => {
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
