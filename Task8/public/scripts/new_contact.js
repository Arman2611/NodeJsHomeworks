
let form = document.querySelector('.contact-form');
let messageBox = document.querySelector('.contact-message-box');
let inputs = document.getElementsByTagName('input');
let button = document.querySelector('button');

let localStorage = window.localStorage;

button.addEventListener('click', sendformData);

const regExpName = /^[a-z]{2,16}$/gi;
const regExpPhone = /^\+374\d{8}$/;

// Collect input fields data and send POST request
function sendformData () {
	let name = inputs[0].value;
	let phone = inputs[1].value.replace(/[-_ ]/g, "");

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

	fetch('/contacts/add', {
		headers: {
			'Accept': 'application/json',
      		'Content-Type': 'application/json'
		},
		method: "POST",
		body: JSON.stringify({
			name: name,
			phone: phone,
		})
	})
	.then(response => response.json())
	.then((data) => {
		if (data === 'contactSuccessfullyAdded') {

			localStorage.setItem('message', 'Contact successfully added');
			window.location = "/"

		} else if (data === "failedToAddContact") {

			messageBox.innerHTML = 'Failed to add contact';
			messageBox.style.opacity = 1;
		}
	})
	.catch(error => console.log(error));
};
