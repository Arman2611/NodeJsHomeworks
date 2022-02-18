

/* Create a Node JS application that will recursively search
all files in the directory given in command-line arguments
and create a new file sorted_files.txt 
and write file paths and sizes in this file
line by line sorted by file size. */


/* Use commands like these */
// node app.js .
// node app.js .\foldername
// node app.js D:\
// node app.js C:\Users\Arman\Downloads


if (!process.argv[2]) {
	console.log("Please write directory name for scanning");
	return;
};

const fs = require("fs");
const path = require("path");
let filesList = [];
let filesCount = 0;

// For case when path contains spaces
let pathname;
if (!process.argv[3]) {
	pathname = process.argv[2];
} else {
	pathname = process.argv[2];
	for (let i = 3; i < process.argv.length; i++) {
		pathname += " " + process.argv[i];
	}
};

// Converting to slash or backslash for different operation systems
if (process.platform === 'win32') {
	pathname = pathname.replace(/\//g, "\\");
} else if (process.platform === 'linux' || process.platform === 'darwin') {
	pathname = pathname.replace(/\\/g, "/");
}

// Delete sorted_files.txt file if it exists
if (fs.existsSync("sorted_files.txt")) {
	fs.unlinkSync("sorted_files.txt");
};

// Get names of all files&folders in given directory
try {
	fs.readdirSync(pathname).forEach(filename => {
		let address = path.join(pathname, filename);
		addFileSize(address);
	});
} catch(error) {
	console.log(error)
	console.log("This directory doesn't exist");
	return;
}

function addFileSize (address) {
	try {
		let statsObject = fs.statSync(address);
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
		}
		else if (statsObject.isDirectory()) {
			fs.readdirSync(address).forEach(filename => {
				addFileSize(path.join(address, filename));
			});
		}
	} catch(error) {
		if (error.code === "EPERM") {
			console.log(`Permission for ${error.path} denied.`);
		} else if (error.code === 'EBUSY') {
			console.log(`${error.path} is busy or locked`);
		} else {
			console.log(`${error.code} error occured`);
		}
	};	
};

// Sorting filesList in descending order
filesList.sort(function (a, b) {
	return b.size - a.size;
});

// Writing logs in sorted_files.txt
filesList.forEach((file) => fs.appendFileSync("sorted_files.txt", file.log));

function printResult () {
	if (filesCount === 0) {
		console.log('There is no file in this directory');
	} else if (filesCount === 1) {
		console.log(`Found ${filesCount} file. Open sorted_files.txt for more information`);
	} else {
		console.log(`Found ${filesCount} files. Open sorted_files.txt for more information`);
	}
};
printResult();
