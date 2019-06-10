const fs = require('fs')

const getCommands = folder => {
	return new Promise((resolve, reject) => {
		fs.readdir(folder, (err, files) => {
			if (err) {
				reject(err)
			}
			resolve(files.map(file => file.split('.')[0]))
		})
	})
}

module.exports = getCommands
