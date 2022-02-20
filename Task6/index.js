

/* Initialize project with npm, eslint, prettier, editorconfig,
install moment.js, run the project using the run script.
Create an app that will write to a stream every second the current time
formatted using moment.js and write that stream to the file.
Use Readable, Writable and Transform APIs exposed from stream module
Use Transform stream to format the Date. */


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


const fs = require('fs');
const stream = require('stream');
const moment = require('moment');
let notesCount = 0;


async function engine() {
	await deletePreviousLogFile();

	const readableStream = new stream.Readable();
	readableStream._read = () => {};


	const transformStream = new stream.Transform();
	transformStream._transform = (chunk, encoding, callback) => {
		let transformedDate = moment(chunk.toString()).format('YYYY-MM-DD HH:mm:ss');
		transformStream.push(transformedDate);
		callback();
	}

	const writableStream = new stream.Writable();
	writableStream._write = (chunk, encoding, next) => {
		let text = chunk.toString() + '\r\n';
		fs.appendFile('./log_file.txt', text, (error) => {
			if (error) {console.log(error)}
		});
		notesCount++;
		next();
	};


	function getTime() {
		setTimeout(() => {
			readableStream.push(new Date().toISOString());
			getTime();
		}, 1000);
	};

	try {
		console.log('Processing...');
		console.log('Press Ctrl + C to stop.');
		getTime();
		readableStream.pipe(transformStream);
		transformStream.pipe(writableStream);

		// So the program will not close instantly
		process.stdin.resume();

		// Catches Ctrl+C event
		process.on('SIGINT', () => {
			if (notesCount === 0) {
				console.log(`Made 0 note.`)
			} else if (notesCount === 1) {
				console.log(`Made 1 note. Open log_file.txt for more information`);
			} else {
				console.log(`Made ${notesCount} notes. Open log_file.txt for more information`);
			};

			// Imitate Ctrl+C event
			process.exit();
		})
	} catch(error) {
		console.log(error);
	};
}


async function deletePreviousLogFile() {
	try {
		await fs.promises.stat("log_file.txt");
		await fs.promises.unlink("log_file.txt");
	} catch(error) {
		if (error.code === "ENOENT") {
			// console.log("log_file.txt doesn't exist");
		} else {
			console.log(error);
		}
	}
	return;
}

engine();
