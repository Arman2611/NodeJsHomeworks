
let messageBox = document.querySelector('#index-message-box');
let deletePopup = document.querySelector('#delete-popup-container');
let deletePopupYesButton = document.querySelector('#delete-popup-yes');
let deletePopupNoButton = document.querySelector('#delete-popup-no');

let localStorage = window.localStorage;

window.onload = function () {
	setTimeout(showMessage, 600)
};

// Show message from localStorage for 5 seconds
function showMessage () {
	let message = localStorage.getItem('message');
	
	if (message != null) {
		messageBox.innerHTML = message;
		localStorage.removeItem('message');
		messageBox.style.opacity = 1;

		setTimeout(() => {
			messageBox.style.opacity = 0;
		}, 5000);
	}
};


/* ------------------------ Delete contact -------------------------- */
let currentDeleteLink;
let deleteButtons = document.getElementsByClassName('delete-btn');

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

for (let i = 0; i < deleteButtons.length; i++) {
	deleteButtons[i].addEventListener('click', showDeletePopup);
};
