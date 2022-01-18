
/* Create a Avengers battle game with setIntervals */

const heroNames = [
	'Groot',
	'Hulk',
	'Dr. Strange',
	'Wolverine',
	'Thor',
	'Captain America',
	'Iron Man',
	'Black Panther',
	'Rocket',
	'Spider Man',
];

const villainNames = [
	'Hidroman',
	'Thanos',
	'Ultron',
	'Ronan',
	'Sandman',
	'Venom',
	'Hela',
	'Taskmaster',
	'Loki',
	'Nebula',
];

const heroes = [];
const villains = [];


/* Is being called while creating characters */
function getRandomNameFrom (array) {
	if (array.length === 0) { return undefined };
	let index = Math.floor(Math.random()*array.length);
	let name = array[index];
	array.splice(index, 1);
	return name;
};


/* ----------------------- Heroes ----------------------- */
class Hero {
	constructor () {
		this.speed = +(1 + Math.random()*4).toFixed(1);
		this.power = +(1 + Math.random()*9).toFixed(1);
		this.health = 100;
		this.name = getRandomNameFrom(heroNames);
		heroes.push(this);
	}
};

function createHeroes () {
	for (let i = 0; i < 10; i++) {
		new Hero();
	};
};
createHeroes();


/* ---------------------- Villains ---------------------- */
class Villain {
	constructor () {
		this.speed = +(1 + Math.random()*4).toFixed(1);
		this.power = +(1 + Math.random()*9).toFixed(1);
		this.health = 100;
		this.name = getRandomNameFrom(villainNames);
		villains.push(this);
	}
};

function createVillains () {
	for (let i = 0; i < 10; i++) {
		new Villain();
	};
};
createVillains();


let winner = undefined;
let hitsCount = 0;
let totalDamage = 0;

/* Decreases health of target */
/* Clears interval of died character */
/* In case of victory clears intervals of alive characters */
function decreaseHealth (array, targetIndex, damage) {
	hitsCount++;
	totalDamage += damage;
	array[targetIndex].health -= damage;
	array[targetIndex].health = +array[targetIndex].health.toFixed(1);

	if (array[targetIndex].health <= 0) {
		let log = `${array[targetIndex].name} dies`;
		console.log(log);

		if (array === heroes) {
			let name = heroes[targetIndex].name
			clearInterval(heroIntervals[name]);
		} else if (array === villains) {
			let name = villains[targetIndex].name
			clearInterval(villainIntervals[name]);
		}

		array.splice(targetIndex, 1);
	};

	if (array.length === 0 && winner === undefined) {
		if (array === heroes) {
			winner = villains;

			/* Clearing intervals of winners */
			for (let i = 0; i < villains.length; i++) {
				villains[i];
				let name = villains[i].name;
				clearInterval(villainIntervals[name]);
			};
		} else if (array === villains) {
			winner = heroes;

			/* Clearing intervals of winners */
			for (let i = 0; i < heroes.length; i++) {
				heroes[i];
				let name = heroes[i].name;
				clearInterval(heroIntervals[name]);
			};
		};
		
		victoryLogFunction();
	};
};


function victoryLogFunction() {
	if (winner === heroes) {
		console.log ('Heroes win');

		let log = 'Alive characters are';
		for (let i = 0; i < heroes.length; i++) {
			log += ` ${heroes[i].name}[${heroes[i].health}]`
		};
		console.log(log);
	} else if (winner === villains) {
		console.log ('Villains win');

		let log = 'Alive characters are';
		for (let i = 0; i < villains.length; i++) {
			log += ` ${villains[i].name}[${villains[i].health}]`
		};
		console.log(log);
	};
	console.log(`Total hits: ${hitsCount}`);
	console.log(`Total damage: ${+totalDamage.toFixed(1)}`);
};


/* Chooses target and calls decreaseHealth function for target */
function attack (damager) {
	if (damager instanceof Hero) {

		let targetIndex = Math.floor(Math.random() * villains.length);
		let target = villains[targetIndex];
		let log = `${damager.name}[${damager.health}] hits ${target.name}[${target.health}] with a power of ${damager.power}`; 
		console.log(log);

		decreaseHealth(villains, targetIndex, damager.power);
	} else if (damager instanceof Villain) {

		let targetIndex = Math.floor(Math.random() * heroes.length);
		let target = heroes[targetIndex];
		let log = `${damager.name}[${damager.health}] hits ${target.name}[${target.health}] with a power of ${damager.power}`;
		console.log(log);

		decreaseHealth(heroes, targetIndex, damager.power); 
	};
};


const heroIntervals = {};
const villainIntervals = {};


/* Setting interval for damager */
/* Intervals shall be removed by decreaseHealth function */
function run (damager) {
	if (damager instanceof Hero) {
		heroIntervals[damager.name] = setInterval(attack, 1 / damager.speed * 5000, damager);
	} else if (damager instanceof Villain) {
		villainIntervals[damager.name] = setInterval(attack, 1 / damager.speed * 5000, damager);
	}
};

for (let i = 0; i < 10; i++) {
	run(villains[i]);
};
for (let i = 0; i < 10; i++) {
	run(heroes[i]);
};
