const path = require('path')
const { homedir } = require('os')
const { existsSync, mkdirSync } = require('fs')

const VV_DIR = path.resolve(homedir(), '.vv')

const vvDirExists = () => {
  try {
    return existsSync(VV_DIR)
  } catch(error) {
    console.log(`An unexpected error occurred while trying to find the vv global directory: ${error}`)
    return false
  }
}

const createVVDir = () => {
  try {
    mkdirSync(VV_DIR)
    return true
  } catch(error) {
    console.log(`An unexpected error occurred while trying to create the vv global directory: ${error}`)
    return false
  }
}

module.exports = {
  vvDirExists,
  createVVDir
}