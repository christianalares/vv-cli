const chalk = require('chalk')

const shouldShowHelp = input => {
  let showHelp = input.length === 0 ? true : false
  const helpCommands = ['-h', '--help', 'help']

  helpCommands.forEach(helpCommand => {
    if (input.includes(helpCommand)) {
      showHelp = true
    }
  })

  return showHelp
}

const showHelp = registeredCommands => {
  const commandsList = Object.keys(registeredCommands).join(`\n        `)

  console.log(`
    ${chalk.bold(`vv cli`)}

      ${chalk.dim('Available commands:')}

        ${commandsList}
      
      ${chalk.dim('Usage:')}

        vv <command> ${chalk.italic('option')}

      ${chalk.dim('All commands supports:')}

        -h, --help        Prints instructions about that command
        -v, --version     Prints out the version for that command
    `)
}

module.exports = {
  shouldShowHelp,
  showHelp
}
