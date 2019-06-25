const fs = require('fs')
const config = require('../config')

const dirExists = path => {
  try {
    return fs.existsSync(path)
  } catch (error) {
    console.log(
      `[dirExists] An unexpected error occurred while trying to find the directory: ${path}:`
    )
    console.log(error)
  }
}

const fileExists = (fullPath, filename) => {
  try {
    return fs.existsSync(fullPath)
  } catch (error) {
    console.log(
      `[fileExists] An unexpected error occurred while trying to find the file: ${fullPath}:`
    )
    console.log(error)
  }
}

const createDir = path => {
  try {
    fs.mkdirSync(path)
  } catch (error) {
    console.log(
      `[createDir] An unexpected error occurred while trying to create the directory: ${path}:`
    )
    console.log(error)
  }
}

const createFile = (fullPath, content = '{}') => {
  try {
    fs.writeFileSync(fullPath, content)
  } catch (error) {
    console.log(
      `[createFile] An unexpected error occurred while trying to create the file: ${fullPath}:`
    )
    console.log(error)
  }
}

const readFile = fullPath => {
  try {
    return fs.readFileSync(fullPath, 'utf8')
  } catch (error) {
    console.log(
      `[readFile] An unexpected error occurred while trying to read the file: ${fullPath}:`
    )
    console.log(error)
  }
}

const updateCommandFile = (commandName, incomingContent) => {
  const fullPath = `${config.VV_DIR}/${commandName}/${config.CONFIG_FILENAME}`

  try {
    const oldContent = readCommandFile(commandName)
    const newContent = {
      ...oldContent,
      ...incomingContent
    }

    fs.writeFileSync(fullPath, JSON.stringify(newContent))
  } catch (error) {
    console.log(
      `[updateCommandFile] An unexpected error occurred while trying to update the file: ${fullPath}:`
    )
    console.log(error)
  }
}

const readCommandFile = command => {
  const fullPath = `${config.VV_DIR}/${command}/${config.CONFIG_FILENAME}`

  try {
    return JSON.parse(readFile(fullPath))
  } catch (error) {
    console.log(
      `[readCommandFile] An unexpected error occurred while trying to read the file: ${fullPath}`
    )
  }
}

const vvDirExists = () => {
  return dirExists(config.VV_DIR)
}

const createVVDir = () => {
  createDir(config.VV_DIR)
}

const checkCommandConfigFiles = commands => {
  commands.forEach(command => {
    const commandPath = `${config.VV_DIR}/${command}`
    if (!dirExists(commandPath)) {
      createDir(commandPath)
      createFile(`${commandPath}/${config.CONFIG_FILENAME}`)
    }

    if (!fileExists(`${commandPath}/${config.CONFIG_FILENAME}`)) {
      createFile(`${commandPath}/${config.CONFIG_FILENAME}`)
    }
  })
}

module.exports = {
  vvDirExists,
  createVVDir,
  readCommandFile,
  updateCommandFile,
  checkCommandConfigFiles
}
