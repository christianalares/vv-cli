const path = require('path')
const { homedir } = require('os')

const config = {
  COMMANDS_FOLDER: './commands',
  CONFIG_FILENAME: 'config.txt',
  VV_DIR: path.resolve(homedir(), '.vv'),
  DIMMED_COLOR: [255, 0, 0]
}

module.exports = config
