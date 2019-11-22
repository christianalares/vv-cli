// const chalk = require('chalk')

const shouldShowVersion = input => {
  let showVersion = false
  const helpCommands = ['-v', '--version']

  helpCommands.forEach(helpCommand => {
    if (input.length === 1 && input.includes(helpCommand)) {
      showVersion = true
    }
  })

  return showVersion
}

const showVersion = () => {
  console.log('0.0.1')
}

module.exports = {
  shouldShowVersion,
  showVersion
}
