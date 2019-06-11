const help = () => console.log('helping...')

const cmd = {
  version: 1,
  _cmd: () => help
}
module.exports = cmd
