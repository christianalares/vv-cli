// const inquirer = require('inquirer')

const help = () => {
	console.log('Lights help')
}

const lightsHelp = () => {
	console.log('Please use one of "lights 1", "lights 0", "lights on" or "lights off"')
}

const on = () => {
	console.log('Turning on lights...')
}

const off = () => {
	console.log('Turning off lights...')
}

const cmd = {
	_cmd: lightsHelp,
	version: 1,
	'--help': {
		_cmd: help
	},
	'1': { _cmd: on },
	'0': { _cmd: off },
	on: { _cmd: on },
	off: { _cmd: off }
}
module.exports = cmd
