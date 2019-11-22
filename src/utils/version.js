const axios = require('axios')
const chalk = require('chalk')
const printMessage = require('print-message')
const { version: currentVersion } = require('../../package.json')

const getPublishedVersion = async () => {
  try {
    const response = await axios.get('https://api.npms.io/v2/package/vinnovera-cli')
    const {
      data: {
        collected: {
          metadata: { version: publishedVersion }
        }
      }
    } = response

    return publishedVersion
  } catch (error) {
    return currentVersion
  }
}

const newerVersionAvailable = async () => {
  let newVersionAvailable = false
  const publishedVersion = await getPublishedVersion()

  const currentVersionArray = currentVersion.split('.')
  const publishedVersionArray = publishedVersion.split('.')

  currentVersionArray.forEach((currentVersionIndex, i) => {
    if (publishedVersionArray[i] > currentVersionIndex) {
      newVersionAvailable = true
    }
  })

  return [newVersionAvailable, publishedVersion]
}

const notifyUpgradeIfAvailable = async () => {
  const [canUpgrade, publishedVersion] = await newerVersionAvailable()
  if (canUpgrade) {
    printMessage(
      [
        `     ${chalk.bold('NEW VERSION AVAILABLE')}     `,
        `     run ${chalk.blue('npm i -g vinnovera-cli')}     `,
        `     to get version ${chalk.green(`v${publishedVersion}`)}     `
      ],
      {
        borderColor: 'green',
        paddingTop: 1,
        paddingBottom: 1
      }
    )
  }
}

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

module.exports = {
  notifyUpgradeIfAvailable,
  shouldShowVersion
}
