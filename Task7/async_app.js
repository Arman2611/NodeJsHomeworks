

/* Create a Node JS application that will recursively search
all files in the directory given in command-line arguments
and create a new file sorted_files.txt 
and write file paths and sizes in this file
line by line sorted by file size. */


/* Use commands like these */
// node async_app.js .
// node async_app.js .\foldername
// node async_app.js D:\
// node async_app.js C:\Users\Arman\Downloads


// Just to be sure, that code is not blocked
const http = require('http');
const server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Hello World!');
  res.end();
});
server.listen(3000, () => {
	// console.log('Server is ready for requests\r\n');
});


const fs = require("fs");
const path = require("path");
let filesList = [];
let filesCount = 0;
let noPermissionFilesCount = 0;

async function checkForArgument() {
	// For case when arguments isn't given
	if (!process.argv[2]) {
		console.log("Please write directory name for scanning");
		return false;
	} else return true
}

async function checkForPathname() {

	// For case when path contains spaces
	let pathname;
	if (!process.argv[3]) {
		pathname = process.argv[2];
	} else {
		pathname = process.argv[2];
		for (let i = 3; i < process.argv.length; i++) {
			pathname += " " + process.argv[i];
		}
	}

	// For case of [C: D: E:] add backslash
	if (pathname[pathname.length-1] === ':') {
		pathname += "\\";
	}

	// Converting to slash or backslash for different operation systems
	if (process.platform === 'win32') {
		pathname = pathname.replace(/\//g, "\\");
	} else if (process.platform === 'linux' || process.platform === 'darwin') {
		pathname = pathname.replace(/\\/g, "/");
	}

	return pathname;
}

async function deletePreviousLogFile() {
	try {
		await fs.promises.stat("sorted_files.txt");
		await fs.promises.unlink("sorted_files.txt");	
	} catch(error) {
		if (error.code === "ENOENT") {
			// console.log("sorted_files.txt doesn't exist");
		} else {
			console.log(error);
		}
	}
	return;
}

async function engine() {
	
	if (await checkForArgument() === false) return;

	let pathname = await checkForPathname();	

	await deletePreviousLogFile();

	try {
		let files = await fs.promises.readdir(pathname);
		// console.log(pathname)
		console.log('Scanning files in given directory...')
		await directoryLoop(files, pathname);
		await sortFilesBySizes();
		await writeLogsInTextFile();
		await printResult();
	} catch(error) {
		if (error.code === "ENOENT") {
			console.log("This directory doesn't exist");
			return;
		} else {
			console.log(`${error.code} error occured`);
		}
	}	
}

async function directoryLoop(files, pathname) {
	for (let i = 0; i < files.length; i++) {
		let address = path.join(pathname, files[i]);
		await addFileSize(address);
	};
	return true;
}

async function addFileSize(address) {
	try {
		let statsObject = await fs.promises.stat(address);
		if (statsObject.isFile()) {

			// Crafting underscores for length
			let underscores = "_____";
			if (address.length < 50) {
				for (let i = 0; i < 50 - address.length; i++) {
					underscores += "_";
				}
			};

			// Changing bytes to kb, mb ...
			let size;
			if (statsObject.size >= 1073741824) {
				size = `${(statsObject.size / 1073741824).toFixed(2) } Gb`
			} else if (statsObject.size >= 1048576) {
				size = `${(statsObject.size / 1048576).toFixed(2) } Mb`
			} else if (statsObject.size >= 1024) {
				size = `${(statsObject.size / 1024).toFixed(2) } Kb`
			} else {
				size = `${statsObject.size} bytes`
			};

			let logText = `${address} ${underscores} ${size}\r\n`;
			filesList.push({size: statsObject.size, log: logText});
			filesCount++;
			return;
		} else if (statsObject.isDirectory()) {
			let files = await fs.promises.readdir(address);
			if (!files[0]) {
				return;
			} else {
				await directoryLoop(files, address);
			}
		}
	} catch(error) {
		if (error.code === "EPERM") {
			console.log(`Permission for ${error.path} denied.`);
			noPermissionFilesCount++;
		} else if (error.code === 'EBUSY') {
			console.log(`${error.path} is busy or locked`);
			noPermissionFilesCount++;
		} else {
			console.log(error + 'ss')
		}
	}	
}

async function sortFilesBySizes() {
	filesList.sort(function (a, b) {
		return b.size - a.size;
	});
}

async function writeLogsInTextFile() {
	for (let i = 0; i < filesList.length; i++) {
		await fs.promises.appendFile("sorted_files.txt", filesList[i].log)
	}
}

async function printResult () {
	if (filesCount === 0) {
		console.log('There is no file in this directory');
	} else if (filesCount === 1) {
		console.log(`Scanned ${filesCount} file. Open sorted_files.txt for more information`);
	} else {
		console.log(`Scanned ${filesCount} files. Open sorted_files.txt for more information`);
	};

	if (noPermissionFilesCount > 1) {
		console.log(`No permission to access ${noPermissionFilesCount} directories`);
	} else if (noPermissionFilesCount == 1) {
		console.log(`No permission to access ${noPermissionFilesCount} directory`);
	};
}

engine();
