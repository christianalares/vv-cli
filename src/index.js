#!/usr/bin/env node
const config = require('./config')
const getCommands = require('./utils/getCommands')
const registerCommands = require('./utils/registerCommands')
const { shouldShowHelp, showHelp } = require('./utils/help')
const { notifyUpgradeIfAvailable, shouldShowVersion, showVersion } = require('./utils/version')
const { hasPath, path } = require('ramda')

const { vvDirExists, createVVDir, checkCommandConfigFiles } = require('./utils/vvDir')

const checkFileSystem = commands => {
  if (!vvDirExists()) {
    createVVDir()
  }
  checkCommandConfigFiles(commands)
}

notifyUpgradeIfAvailable()

getCommands(config.COMMANDS_FOLDER).then(commands => {
  checkFileSystem(commands)
  const registeredCommands = registerCommands(commands)
  const input = process.argv.filter(arg => !arg.includes('/'))
  const [baseCommand, ...rest] = input
  const foundCommand = registeredCommands[baseCommand]

  if (hasPath(rest, foundCommand)) {
    path(rest, foundCommand)['_cmd']()
  } else if (rest.length === 0 && foundCommand) {
    foundCommand['_cmd']()
  } else if (shouldShowVersion(input)) {
    showVersion()
  } else if (shouldShowHelp(input)) {
    showHelp(registeredCommands)
  } else {
    console.log(`Invalid command: ${rest.join(' ')}`)
  }
})
