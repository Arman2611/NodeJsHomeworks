
let form = document.querySelector('.contact-form');
let messageBox = document.querySelector('.contact-message-box');
let inputs = document.getElementsByTagName('input');
let localStorage = window.localStorage;

let deleteButton = document.querySelector('#delete-btn');
let saveButton = document.querySelector('#save-btn');
const id = saveButton.getAttribute('data-id');

let deletePopup = document.querySelector('#delete-popup-container');
let deletePopupYesButton = document.querySelector('#delete-popup-yes');
let deletePopupNoButton = document.querySelector('#delete-popup-no');

let oldName =inputs[0].value;
let oldPhone = inputs[1].value.replace(/[-_ ]/g, "");


/* ------------------------ Save contact -------------------------- */

const regExpName = /^[a-z]{2,16}$/gi;
const regExpPhone = /^\+374\d{8}$/;

saveButton.addEventListener('click', sendformData);

// Collect input fields data and send POST request
function sendformData () {
	let name = inputs[0].value;
	let phone = inputs[1].value.replace(/[-_ ]/g, "");

	// If inputs data have not been changed
	if (name === oldName && phone === oldPhone) {
		messageBox.innerHTML = 'No changes are made';
		messageBox.style.opacity = 1;
		return;
	}

	// Client-side validation
	if (name === '' || phone === '') {
		messageBox.innerHTML = 'Please complete all fields';
		messageBox.style.opacity = 1;
		return;
	};
	if (name.match(regExpName) == null) {
		messageBox.innerHTML = 'name shall contain from 2 to 16 english letters and no other symbol';
		messageBox.style.opacity = 1;
		return;
	};
	if (phone.match(regExpPhone) == null) {
		messageBox.innerHTML = 'phone number shall be in this format: +374 XX XX XX XX';
		messageBox.style.opacity = 1;
		return;
	};

	fetch('/contacts/change', {
		headers: {
			'Accept': 'application/json',
      		'Content-Type': 'application/json'
		},
		method: "POST",
		body: JSON.stringify({
			id: id,
			name: name,
			phone: phone
		})
	})
	.then(response => response.json())
	.then((data) => {
		if (data === 'contactSuccessfullyChanged') {
			
			localStorage.setItem('message', 'Contact successfully changed');
			window.location = "/"

		} else if (data === "failedToChangeContact") {

			messageBox.innerHTML = 'Failed to change contact';
			messageBox.style.opacity = 1;
		}
	})
	.catch(error => console.log(error));
};


/* ------------------------ Delete contact -------------------------- */
let currentDeleteLink;

function deleteContact () {

	fetch(currentDeleteLink)
	.then(response => response.json())
	.then((message) => {
		if (message === 'contactSuccessfullyDeleted') {
			localStorage.setItem('message', 'Contact successfully deleted');
		} else if (message === 'failedToDeleteContact') {
			localStorage.setItem('message', 'Failed to delete contact');
		};
		window.location = "/";
	})
	.catch(error => console.log(error));
};

function showDeletePopup (event) {
	currentDeleteLink = event.target.getAttribute('data-delete-link');
	deletePopup.style.display = 'flex';
}

function hideDeletePopup () {
	deletePopup.style.display = 'none';
}

deletePopupNoButton.addEventListener('click', hideDeletePopup);
deletePopupYesButton.addEventListener('click', deleteContact);

deleteButton.addEventListener('click', showDeletePopup);
