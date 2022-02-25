

/* Create a Contacts web application, that will have Home, New, Edit pages, 
buttons for deleting contacts both on Home and Edit pages. 
Use middleware for validating contact data (validate name as a string with 
min-length 2 and without any character other than letter 
and phone number as an Armenian phone number),
use pug for view engine, use the express router. */


const fs = require('fs');
const express = require('express');
const path = require('path');
const pug = require('pug');

const database = path.join(__dirname, '/database.json');

const app = express();


/* -------------------------------- View Engine -------------------------------- */
app.set('views', __dirname + '/public/views');
app.set('view engine', 'pug');


/* -------------------------------- Middlewares -------------------------------- */

// Used to response static files (Css, js) from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Used to access req.body in post requests
app.use(express.json());


/* ---------------------------------- Routers ---------------------------------- */
const mainRouter = express.Router();
const addContactRouter = express.Router();
const newContactPageRouter = express.Router();
const editContactPageRouter = express.Router();
const deleteContactRouter = express.Router();
const changeContactRouter = express.Router();


app.use('/', mainRouter);
app.use('/contacts/add', addContactRouter);
app.use('/contacts/new', newContactPageRouter);
app.use('/contacts/edit', editContactPageRouter);
app.use('/contacts/delete', deleteContactRouter);
app.use('/contacts/change', changeContactRouter);


addContactRouter.use(serverSideValidator);
changeContactRouter.use(serverSideValidator);


/* ------------------------------ Form validation ------------------------------ */
function serverSideValidator (req, res, next) {

	const regExpName = /^[a-z]{2,16}$/gi;
	const regExpPhone = /^\+374\d{8}$/;

	const name = req.body.name;
	const phone = req.body.phone;

	if (name.match(regExpName) == null || phone.match(regExpPhone) == null) {
		res.status(200).send(JSON.stringify('dataIsNotValid'));
	} else {
		next();
	}	
};


/* --------------------------------- Main Page --------------------------------- */
mainRouter.get('/', async (req, res) => {
	try {
		let base = await readDatabase();
		res.render('index', {base: base});
	} catch(error) {		
		console.log(error);
	};
})

mainRouter.get('/new', (req, res) => {
	res.redirect('/contacts/new');
})


/* ------------------------------ New Contact Page ----------------------------- */
newContactPageRouter.get('/', (req, res) => {
	res.render('new_contact');
})


/* ----------------------------- Edit Contact Page ----------------------------- */
editContactPageRouter.get('*', async (req, res) => {
	let id = req.url.slice(2,9);
	let base = await readDatabase();

	for (i in base) {
		if (base[i].id === id) {
			res.render('edit_contact', {
				id: base[i].id,
				name: base[i].name,
				phone: base[i].phone,
			});
			break;
		}
	};
});


/* -------------------------------- Add Contact -------------------------------- */
addContactRouter.post('/', async (req, res) => {
	try {
		let base = await readDatabase();

		// Get all ID-s from database.json
		let arrayOfIds = base.map((obj) => obj.id);

		// Ask idGenerator to create a unique ID
		let id =  await idGenerator(arrayOfIds);

		base.push({
			id: id,
			name: req.body.name,
			phone: req.body.phone
		});

		let modifiedBase = JSON.stringify(base, null, 2);
		await writeDatabase(modifiedBase);
		res.status(200).send(JSON.stringify('contactSuccessfullyAdded'));

	} catch(error) {		
		console.log(error);
		res.status(200).send(JSON.stringify('failedToAddContact'));
	};
})


/* ------------------------------- Change Contact ------------------------------ */
changeContactRouter.post('*', async (req, res) => {
	try {
		let base = await readDatabase();

		for (i in base) {
			if (base[i].id === req.body.id) {
				base[i] = {
					id: req.body.id,
					name: req.body.name,
					phone: req.body.phone
				}
				break;
			}
		};

		let modifiedBase = JSON.stringify(base, null, 2);
		await writeDatabase(modifiedBase);
		res.status(200).send(JSON.stringify('contactSuccessfullyChanged'));

	} catch(error) {
		console.log(error);
		res.status(200).send(JSON.stringify('failedToChangeContact'));
	}
});


/* ------------------------------- Delete Contact ------------------------------ */
deleteContactRouter.get('*', async (req, res) => {
	try {
		let id = req.url.slice(2,9);
		let base = await readDatabase();

		for (i in base) {
			if (base[i].id === id) {
				base.splice(i,1);
				break;
			}
		};

		let modifiedBase = JSON.stringify(base, null, 2);
		await writeDatabase(modifiedBase);
		res.status(200).send(JSON.stringify('contactSuccessfullyDeleted'));

	} catch(error) {		
		console.log(error);
		res.status(200).send(JSON.stringify('failedToDeleteContact'));
	};
});



/* ------------------------------- Read Database ------------------------------- */
async function readDatabase () {
	return await fs.promises.readFile(database)
	.then((rawdata) => JSON.parse(rawdata.toString()))
	.catch(error => console.log(error));
};


/* ------------------------------- Write Database ------------------------------ */
async function writeDatabase (modifiedBase) {
	fs.writeFile(database, modifiedBase, (error) => {
		if (error) {
			console.log(error);
		}
	});
};


/* -------------------------------- ID Generator ------------------------------- */
function idGenerator(arrayOfIds) {
	let symbols = '0123456789';
	let id = '';

	for (let i = 0; i < 7; i++) {
		let index = Math.floor(Math.random()*10);
		id += symbols[index];
	};

	// To avoid ID repeatings
	for (let j = 0; j < arrayOfIds.length; j++) {		
		if (arrayOfIds[j] == id) {
			id = idGenerator(arrayOfIds);
		};
	};

	return id;
};


app.listen(3000, () => {
	console.log('Server listening to port 3000')
});
