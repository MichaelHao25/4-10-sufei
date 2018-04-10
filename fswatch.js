var fs = require('fs');
const crypto = require('crypto');
var fileDirectory = __dirname
var arryfilename = {}



function changeName(url) {
	fs.readFile(url, (err, data) => {
		if (err) throw err;
		var strdata = data.toString()
		for (attr in arryfilename) {
			console.log(attr + '.' + arryfilename[attr][1])
			var re = new RegExp(attr + '.' + arryfilename[attr][1], 'gi')
			strdata = strdata.replace(re, arryfilename[attr][0] + '.' + arryfilename[attr][1]);
		}
		fs.writeFile(url, strdata, function(error) {
			if (error) {
				console.log(error)
			}
			return;
		})
	});
}


fs.readdir(fileDirectory + '/img', function(err, files) {
	if (err) {
		console.log(err);
		return;
	}
	files.forEach(function(filename) {
		myhash(fileDirectory, filename, files.length)
	})

})
//hash改名字完毕

// readHtml(fileDirectory, 'html', 'abc')
// readHtml(fileDirectory, 'qq.png', 'qq男1111.png')
// fs.watch(fileDirectory, function(eventType, filename) {
// 	if (eventType == 'rename') {
// 		console.log(eventType)
// 		console.log(filename)

// 		fileisnull(fileDirectory, filename)
// 		// var data = filename;
// 		// var key = 'Password!';
// 		// var encrypted = aesEncrypt(data, key);
// 		// var decrypted = aesDecrypt(encrypted, key);

// 		// console.log('Plain text: ' + data);
// 		// console.log('Encrypted text: ' + encrypted);
// 		// console.log('Decrypted text: ' + decrypted);
// 	}
// })

// function aesEncrypt(data, key) {
// 	const cipher = crypto.createCipher('aes192', key);
// 	var crypted = cipher.update(data, 'utf8', 'hex');
// 	crypted += cipher.final('hex');
// 	return crypted;
// }

// function aesDecrypt(encrypted, key) {
// 	const decipher = crypto.createDecipher('aes192', key);
// 	var decrypted = decipher.update(encrypted, 'hex', 'utf8');
// 	decrypted += decipher.final('utf8');
// 	return decrypted;
// }

function fileisnull(fileDirectory, filename) {
	fs.open(fileDirectory + '/' + filename, 'r', function(error, fd) {
		if (error) {
			console.log('file is delete');
		} else {
			myhash(fileDirectory, filename)
		}
	})
}

function myhash(fileDirectory, filename, filelength) {
	var rs = fs.createReadStream(fileDirectory + '/img/' + filename)
	var hash = crypto.createHash('md5');

	rs.on('data', hash.update.bind(hash));

	rs.on('end', function() {
		var newname = hash.digest('hex');
		var exte = filename.split('.')
		rename(fileDirectory, filename, newname + '.' + exte[exte.length - 1])
		arryfilename[exte[0]] = [newname, exte[exte.length - 1]]
		var jsonLength = 0
		for (var attr in arryfilename) {
			jsonLength++
		}
		if (jsonLength == 5) {
			console.log(arryfilename);
			// changeName(fileDirectory)
			readHtml(fileDirectory);
		}
	});
}

function rename(fileDirectory, filename, newname) {
	if (filename == newname) {
		return;
	}
	fs.rename(fileDirectory + '/img/' + filename, fileDirectory + '/img/' + newname, function(error) {
		if (error) {
			console.log('file repeat')
			delete(fileDirectory + '/' + filename);
			return;
		}
	})
}


function fileDelete(url) {

	fs.unlink(url, (error) => {
		if (error) {
			console.log(error)
			return;
		}
		console.log('file delete.')
	})
}


function readFile(url, name, picname, picnewname) {
	// fs.readFile(url, (err, data) => {
	// 	if (err) {
	// 		console.log(err)
	// 		return;
	// 	}
	// console.log(url)
	// console.log(name)
	var data = fs.createReadStream(url)
	data.setEncoding('utf-8')
	data.on('data', (chunk) => {
		console.log(`Received ${chunk.length} bytes of data.`);
		var strdata = chunk
		var re = new RegExp(picname, 'gi')
		strdata = strdata.replace(re, picnewname);
		var writestr = fs.createWriteStream(url)
		writestr.write(strdata);

	});
	data.on('end', (chunk) => {
		console.log('end');
	});
	// var strdata = data.read();
	// // console.log(strdata);
	// console.log(picname + ' ' + picnewname)
	// writestr.write(strdata, 'utf-8', function() {
	// 	console.log('write over');
	// })

	// fs.writeFile(url, strdata, function(error) {
	// 	if (error) {
	// 		console.log(error)
	// 		return
	// 	}
	// })
	// });
}


function readHtml(fileDirectory) {
	fs.readdir(fileDirectory, function(err, files) {
		if (err) {
			console.log(err);
			return;
		}
		files.forEach(function(filename) {
			if (filename.match(/(\.html|input|css|js)$/)) {
				// console.log(filename)
				var arry = filename.split('.')
				if (arry.length == 1) {
					// console.log('next')
					// console.log(arry[0]);
					readDir(fileDirectory + '/' + arry[0])
				} else {
					// console.log(arry[1])
					if (arry[1] == 'html') {
						changeName(fileDirectory + '/' + filename);
					}
				}
				// console.log(arry.length);
				// readFile(fileDirectory + '/' + filename);
			}
			// if (filename.match(/css$/) == 'css') {
			// 	console.log(filename);
			// 	// readFile(fileDirectory + '/' + filename);
			// }
			// if (filename.match(/input$/) == 'input') {
			// 	console.log(filename);
			// 	// readFile(fileDirectory + '/' + filename);
			// }
		})

	})
}



function readDir(url) {
	fs.readdir(url, function(err, files) {
		if (err) {
			console.log(err);
			return;
		}
		files.forEach(function(filename) {
			// console.log(url);
			changeName(url + '/' + filename);
		})

	})
}
