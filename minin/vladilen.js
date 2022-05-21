// Урок 1. Что такое Prototype

// const person = {
//    name: "Maxim",
//    age: 25,
//    greet: function() {
//       console.log('Greet!')
//    }
// }

const person = new Object({ // переменная person - instance класса Object
	name: "Maxim",
	age: 25,
	greet: function() {
		console.log('Greet!')
	}
})

Object.prototype.sayHello = function() {
	console.log('Hello!')
}

const lena = Object.create(person)
lena.name = 'Elena'

const str = 'I am string'
const str = new String('I am string')


// Урок 2. Контекст this

function hello() {
	console.log('Hello', this) // this указывает на текущий контекст
}

const person = {
	name: 'Vladilen',
	age: 25,
	sayHello: hello,
	sayHelloWindow: hello.bind(this),
	// sayHelloWindow: hello.bind(window)
	// sayHelloWindow: hello.bind(document)
	logInfo: function(job, phone) {
		console.group(`${this.name} info:`);
		console.log(`Name is ${this.name}`)
		console.log(`Name is ${this.age}`)
		console.log(`Job is ${job}`)
		console.log(`Phone is ${phone}`)
		console.groupEnd()
	}
}

const lena = {
	name: 'Elena',
	age: 23
}

person.logInfo.bind(lena)   // bind не вызывает новую функцию, а просто возвращает её
person.logInfo.bind(lena)() // а теперь мы сразу эту функцию вызываем

const fnLenaInfoLog = person.logInfo.bind(lena, 'Frontend', '8-999-123-12-23')
fnLenaInfoLog()

person.logInfo.bind(lena, 'Frontend', '8-999-123-12-23')()
person.logInfo.call(lena, 'Frontend', '8-999-123-12-23') // сразу вызывает
person.logInfo.apply(lena, ['Frontend', '8-999-123-12-23']) // второй параметр всегда массив из аргументов которые попадут в эту функцию, сразу вызывает её


// ======================================

const array = [1, 2, 3, 4, 5]

function multBy(arr, n) {
	return arr.map(function(i) {
		return i * n
	})
}

console.log(multBy(array, 5))

Array.prototype.multBy = function(n) {
	// console.log('multBy', this)
	return this.map(function(i) {
		return i * n
	})
}

console.log(array.multBy(2))


// Урок 3. Замыкания

function createCalcFunction(n) {
	return function () {
		console.log (1000 * n)
	}
}

createCalcFunction(42) // возвращает новую функцию, поэтому можем занести её в отдельную переменную
const calc = createCalcFunction(42) // calc - функция, которую мы получаем из другой функции
calc()

function createIncrementor(n) {
	return function(num) {
		return n + num
	}
}

const addOne = createIncrementor(1)

console.log(addOne(10))

function urlGeneration(domain) {
	return function(url) {
		return `https://${url}.${domain}`
	}
}

const comUrl = urlGeneration('com')
console.log(comUrl('google'))


function bind(context, fn) {
	return fucntion(...args) {
		fn.apply(context, args)
	}
}


// Урок 4. Асинхронность. Event Loop. JS SetTimeout

window.setTimeout(function() {
	console.log('Inside timeout, after 2000 seconds')
}, 2000)


// Урок 5. Все про объекты

const person = Object.create(
	{
		// в данном объекте мы указываем прототип нового созданного объекта person
		calculateAge() {
			console.log('Age:', new Date().getFullYear() - this.birthYear)
		}
	}, 
	{
		name: {
			value: 'Vladilen',
			enumerable: true, // property descriptor, позволяет манипулировать с ключами данного объекта
			writable: true,
			configurable: true // данный параметр говорит о том, что мы можем удалять какой-либо ключ из объекта
		},
		birthYear: {
			value: 1993,
			enumerable: false, // по умолчанию стоит такое значение
			writable: false,
			configurable: false // в этом случае ключ удалить не сможем
		},
		age: {
			get() {
				// return 'Heloo' // правило геттера заключается в том, что тут мы возвращаем какую-то новую строчку
				return new Date().getFullYear() - this.birthYear // контекст this, то есть текущий объект
			},
			set(value) { // это не функция, это просто его (объекта) определенное поле
				document.body.style.background = 'red'
			}
		}
})

person.name = 'Maxim' // поле меняется потому, что проперти дескриптор в объекте выше writable - true

for (let key in person) { // таким образом мы не можем обойти объект, созданный выше
	if (person.hasOwnProperty(key)) { // данный метод (проверка) позволяет не пробегаться по прототипу
		console.log ('Key', key, person[key])
	}
}
// геттеры и сеттеры get() set() - реактивный и динамический функционал для проектов


// Урок 6. Всё о классах

const animal = {
	name: 'Animal',
	age: 5,
	hasTail: true
}

class Animal {

	static type = 'ANIMAL' // если переменная или метод являются статическим, тогда они доступны только у самого класса

	constructor(options) {
		this.name = options.name
		this.age = options.age
		this.hasTail = options.hasTail
	}

	voice() {
		console.log('I am animal!')
	}

}

const animal = new Animal({
	name: 'Animal',
	age: 5,
	hasTail: true
})

class Cat extends Animal {
	static type = 'CAT'

	constructor(options) {
		super(options) // вызываем родительский конструктор, по сути это метод
		this.color = options.color
	}

	voice() {
		super.voice()
		console.log('I am cat!') // если в дочернем классе реализован какой-то метод, то он перетирает родительский
	}

	get ageInfo() { // это не метод, а именно поле, потому что это геттер
		return this.age * 7
	}

	set ageInfo(newAge) {
		this.age = newAge
	}
}

const cat = new Cat({
	name: 'Cat',
	age: 7,
	hasTail: true,
	color: 'black'
})

class Component {
	constructor(selector) { // метод конструктор который принимает параметр селектор
		this.$el = document.querySelector(selector) // через доллар называем те переменные, которые содержат в себе dom-ноду
	}

	hide() {
		this.$el.style.display = 'none'
	}

	show() {
		this.$el.style.display = 'block'
	}
}

class Box extends Component {
	constructor(options) {
		super(options.selector)

		this.$el.style.width = this.$el.style.height = options.size + 'px'
		this.$el.style.background = options.color
	}
}

const box1 = new Box({
	selector: '#box1',
	size: 100,
	color: 'red'
})

class Circle extends Box {
	constructor(options) {
		super(options)

		this.$el.style.borderRadius = '50%'
	}
}

const c = new Circle({
	selector: '#circle',
	size: 90,
	color: 'green'
})


// Урок 7. Асинхронность

console.log('Start')

console.log('Start 2')

function timeout2sec() {
	console.log('timeout2sec')
}

window.setTimeout(() => {
	console.log('Inside timeout, after 2000 seconds')
}, 2000)

setTimeout(timeout2sec, 2000)

console.log('End')


// Урок 8. Промисы

console.log('Reauest data...')

setTimeout(() => {
	console.log('Preparing data')

	const backendData = {
		server: 'aws',
		port: 2000,
		status: 'working'
	}

	setTimeout(() => {
		backendData.modified = true
		console.log('Data received', backendData)
	}, 2000);

}, 2000);

const p = new Promise((resolve, reject) => {
	setTimeout(() => {
		console.log('Preparing data')
		const backendData = {
			server: 'aws',
			port: 2000,
			status: 'working'
		}
		resolve(backendData)
	}, 2000)
})

p.then // промис КОГДА выполнится... - читается когда

p.then(data => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			data.modified = true
			resolve(data)
		}, 2000);
	})
})
	.then(clientData => {
		clientData.fromPromise = true
		return clientData
	})
	.then(data => {
		console.log('Modified', data)
	})
	.catch(err => console.error('Error:', err))
	.finally(() => console.log('Finally'))

const sleep = ms => {
	return new Promise(resolve => {
		setTimeout(() => resolve(), ms)
	})
}

sleep(2000).then(() => console.log('After 2 sec'))
sleep(3000).then(() => console.log('After 3 sec'))

Promise.all([sleep(2000), sleep(3000)])
	.then(() => {
		console.log('All promises')
	})

	Promise.all([sleep(2000), sleep(3000)])
	.race(() => {
		console.log('Race promises')
	})


// Урок 9. Async Await

const delay = ms => {
	return new Promise(r => setTimeout(() => r(), ms))
}

delay(2000).then(() => console.log('2 sec'))

const url = 'https://jsonplaceholder.typicode.com/todos'

function fetchTodos() {
	console.log('Fetch todo started...')
	return delay(2000)
		.then(() => fetch(url))
		.then(response => response.json())
}

fetchTodos()
	.then(data => {
		console.log('Data:, data')
	})
	.catch(e => console.error(e))

async function fetchAsyncTodos() {
	console.log('Fetch todo started...')
	try {
		await delay(2000)
		const response = await fetch(url)
		const data = await response.json()
		console.log('Data:, data')
	} catch (e) {
		console.error(e)
	} finally {
		
	}
}

fetchAsyncTodos()


// Урок 10. Запросы на сервер

const requestURL = 'https://json...'
// xhr - xml http request

function sendRequest(method, url, body = null) {
	return new Promise( (resolve, reject) => {
		const xhr = new XMLHttpRequest()
		xhr.open(method, url) // открываем завпрос
		xhr.responseType = 'json'
		xhr.setRequestHeader('Content-Type', 'application/json')
		xhr.onload = () => {
			if (xhr.status >= 400) {
				reject(xhr.response)
			} else {
				resolve(xhr.response)
			}
			// console.log(JSON.parse(xhr.response))
			console.log(xhr.response)
		}
		xhr.onerror = () => {
			reject(xhr.response)
		}
		xhr.send(JSON.stringify(body)) // отправляем запрос
	})
}

sendRequest('GET', requestURL)
	.then(data => console.log(data))
	.catch(err => console.log(err))

const body = {
	name: 'Vladilen',
	age: 26
}

sendRequest('POST', requestURL, body)
	.then(data => console.log(data))
	.catch(err => console.log(err))

// Fetch API

function sendRequest(method, url, body = null) {
	return fetch(url).then(response => {
		return response.json()
	})
}


// Урок 11. Spread Rest

const citiesRussia = ['Moskva', 'Saint-P', 'Kazan', 'Novosibirsk']
const citiesEurope = ['Berlin', 'Praga', 'Paris']

const citiesRussiaWithPopulation = {
	Moscow: 20,
	SaintPetersburg: 8,
	Kazan: 5,
	Novosibirsk: 3
}

const citiesEuropeWithPopulation = {
	Berlin: 10,
	Praha: 3,
	Paris: 2
}

// Spread
// разворачивает все его эллементы, то есть убирает из него массив
// этот оператор более мощный, т.к. позволяет работать и с объектами

console.log(...citiesRussia) // разворачивает массив, с которым работаем. В строку

const allCities = [...citiesRussia, 'Burn', ...citiesEurope]
const allCities = citiesEurope.concat(citiesRussia) // раньше это выглядело так
console.log(allCities)

console.log({...citiesRussiaWithPopulation}) // мы создали новый объект и создали новый объект, то есть склонировали
console.log({...citiesRussiaWithPopulation, ...citiesEuropeWithPopulation}) // здесь происходит умный merge

// Practice
const numbers = [5, 37, 42, 17]
console.log(Math.max(5, 37, 42, 17))
console.log(Math.max(...numbers)) // массив данная функция не принимает, но с помощью оператора развернули массив и ок
console.log(Math.max.apply(null, numbers)) // так делали раньше

const divs = document.querySelectorAll('div')
const nodes = [...divs] // конвертировали node-list в массив
console.log(divs, Array.isArray(divs))
console.log(nodes, Array.isArray(nodes))

// Rest
function sum(a, b, ...rest) { // собирает оставшиемся аргументы в новый массив с названием rest
	// console.log(rest)
	return a + b + rest.reduce((a, i) => a + i, 0)
}

const numbers = [1, 2, 3, 4, 5]

console.log(sum(...numbers)) // SPREAD!!

// const a = numbers[0]
// const b = numbers[1]

const [a, b, ...other] = numbers // деструктуризация, запись идентична тому, что написано выше

console.log(a, b, other)

const person = {
	name: 'Max',
	age: 20,
	city: 'Moscow',
	country: 'Russia'
}

const {name, age, ...address} = person


// Урок 12. Деструктуризация

// работа с массивами
function calcValues(a, b) {
	return [
		a + b,
		a - b, // undefined
		a * b,
		a / b
	]
}

const [sum, sub] = calcValues( 42, 10)
const [sum, sub, mult] = calcValues( 42, 10)
const [sum,, mult] = calcValues( 42, 10)
const [sum,, mult, ...other] = calcValues( 42, 10)
const [sum, sub = 'Вычитания нет', mult, ...other] = calcValues( 42, 10)
const sum = result[0]
const sub = result[1]
const [sum, sub] = result

console.log(sum, sub)
console.log(sum, mult)
console.log(sum, mult, other)
console.log(sum, mult, other, sub)

// работа с объектами
const person = {
	name: 'Max',
	age: 20,
	address: {
		country: 'Russia',
		city: 'Moscow'
	}
}

const name = person.name
const {name, age, car = 'Машины нет'} = person
const {name: firstName, age, car = 'Машины нет'} = person

const {
	name: firstName = 'Без имени',
	age,
	car = 'Машины нет',
	address: {city: homeTown, country}
} = person

console.log(name, age, car)
console.log(firstName, age, car, address)
console.log(firstName, age, car, homeTown, country)

const {name, ...info} = person

console.log(name, info)

function logPerson(per) {
	console.log(per.name + ' ' + per.age)
}

function logPerson({name: firstName = '111', age}) {
	console.log(firstName + ' ' + age)
}

logPerson(person)


// Урок 13. LocalStorage
const myNumber = 42

localStorage.removeItem('number') // убирает только нужный нам ключ
console.log(localStorage.getItem('number'))
localStorage.setItem('number', myNumber.toString()) // .toString указываем явно, но можно не делать так
console.log(localStorage.getItem('number'))
localStorage.clear() // убирает все

const object = {
	name: 'Max'
	age: 20
}

localStorage.setItem('person', JSON.stringify(object)) // из объекта в строку

const raw = localStorage.getItem('person')
const person = JSON.parse(raw)
raw.name = 'Vladilen'

console.log(typeof JSON.parse(raw)) // из строки к объекту
console.log(JSON.parse(raw)) // получаем обычный объект, с которым можно работать
console.log(person)

window.addEventListener('storage', event => {

}) // или так записать можно

window.onstorage = () => {} // или так

window.addEventListener('storage', event => {

})


// Урок 14. Методы массивов

const people = [
	{ name: 'Vladilen', age: 25, budget: 40000 },
	{ name: 'Elena', age: 17, budget: 3400 },
	{ name: 'Igor', age: 49, budget: 50000 },
	{ name: 'Mihail', age: 15, budget: 1800 },
	{ name: 'Vasilisa', age: 24, budget: 25000 },
	{ name: 'Viktoria', age: 38, budget: 2300 }
]

for (let i = 0; i < people.length; i++) { // такая запись будет работать на бОЛьшом кол-ве браузеров
	console.log(people[i])						// потому что это ES5 синтаксис
}

for (let person of people) { // на каждой итерации создаем переменную person. Здесь уже ES6
	console.log(person)
}

// For Each

people.forEach(function (person, index, pArr) { // три параметра: каждый объект person данного массива, индекс, сам массив
	console.log(person)
	console.log(index)
	console.log(pArr)
})

people.forEach(function (person) { // сокращенная запись без лишних параметров, которые используют редко
	console.log(person)
})

people.forEach(person => console.log(person))

// Map

// создаем новые массивы и как результат заносим им новую переменную. Создаем новый массив
const newPeople = people.map(person => { // читается "для каждого объекта массива people"
	return person.name // получаем массив, состоящий из строк, где каждый элемент - нужный нам человек
	return 'Hello' // для каждого объекта массива пипол мы будем преобразовывать его в строчку хеллоу
})

const newPeople = people.map(person => `${person.name} (${person.age})`)
const newPeople = people.map(person => person.age * 3)
console.log(newPeople)

// Filter
// служит для фильтрации исходного массива по условию
const adults = []
for (let i = 0; i < people.length; i++) {
	if (people[i].age >= 18) {
		adults.push(people[i])
	}
}
console.log(adults)

const adults = people.filter(person => {
	if (person.age >= 18) {
		return true
	}
})
console.log(adults)

const adults = people.filter(person => person.age >= 18)
console.log(adults)

// Reduce
// получаем финальное значение, совершив итерацию по массиву
let amount = 0;
for (let i = 0; i < people.length; i++) {
	amount += people[i].budget
}
console.log(amount)

const amount = people.reduce((total, person) => { // два параметра: первый - тотал и итерируемый элемент массива, второй - некоторое начальное значение, которое будет присвоено переменной тотал
	return total + person.budget
}, 0)
console.log(amount)

const amount = people.reduce((total, person) => total + person.budget, 0)
console.log(amount)

// Find
const igor = people.find(person => person.name === 'Igor')
console.log(igor)

// FindIndex
const igorIndex = people.findIndex(person => person.name === 'Igor')
console.log(igorIndex)

// =====================

const amount = people
	.filter(person => person.budget > 3000)
	.map(person => {
		return {
			info: `${person.name} (${person.age})`,
			budget: person.budget
		}
	})
	.reduce((total, person) => {total + person.budget}, 0)

console.log(amount)


// Урок 15. Proxy
// создаем ловушки для объектов, функций, классов и т.д.

// Objects
const person = {
	name: 'Vladilen',
	age: 25,
	job: fullstack
}

const op = new Proxy(person, { // идея прокси в том, что у нас теперь поставлена ловушка на метод get
	get(target, prop) {
		console.log(`Getting prop ${prop}`)
		return target[prop]
	},
	set(target, prop, value) {
		if (prop in target) {
			target[prop] = value
		} else {
			throw new Error(`No ${prop} field in target`)
		}
	},
	has(target, prop) {
		return ['age', 'name', 'job'].includes(prop)
	},
	deleteProperty(target, prop) {
		console.log('Deleting', prop)
		delete target[prop]
		return true
	}
})

// Functions

const log = text => `Log: ${text}`

const fp = new Proxy(log, {
	apply(target, thisArg, args) { // thisArg - контекст, если мы его передавали с помощью метода call или bind
		console.log('Calling fn...') // args - все параметры, которые мы передаем в нашу функцию

		return target.apply(thisArg, args)
		.toUpperCase // метод Apply принимает массив аргументов, когда мы не знаем сколько аргументов - удобно
	}
})

// Classes

class Person {
	constructor(name, age) {
		this.name = name
		this.age = age
	}
}

const PersonProxy = new Proxy(Person, {
	construct(target, args) { // trap или ловушка иначе
		console.log('Construct...')

		return new Proxy(new target(...args), {
			get(t, prop) {
				console.log(`Getting prop "${prop}"`)
				return t[prop]
			}
		})
	}
})

const p = new PersonProxy('Maxim', 30)


// Урок 16. Генераторы
// По сути это некоторые функции, которые могут последовательно выдавать нам результат её работы

function* strGenerator() {
	yield // специальное ключевое слово внутри функции, порционно выдает нам результат, который мы хотит выдать наружу
	yield 'H'
	yield 'e'
	yield 'l'
	yield 'l'
	yield 'o'
}

const str = strGenerator // создаем объект str из функции strGenerator
str.next()
str.next().value

function* numberGen(n = 10) {
	for(let i = 0; i < n; i++) {
		yield i
	}
}
const num = numberGen(7)

const iterator = {
	// gen(n = 10) {
	[Symbol.iterator](n = 10) { // специальный класс Symbol и у него есть ключ iterator - нужно для работы в for of
		let i = 0
		return {
			next() {
				if (i < n) {
					return { value: ++i, done: false }
				}
				return { value: undefined, done: true }
			}
		}
	}
}

for (let k of 'Hello') {
	console.log(k)
}

function* iter(n = 10) {
	for (let i = 0; i < n; i++)
	yield i
}

for (let k of iterator) {
	console.log(k)
}

for (let k of iter(6)) {
	console.log(k)
}


// Урок 17. Map, Set, WeakMap, WeakSet

const obj = {
	name: 'Vladilen',
	age: 26,
	job: 'Fullstack'
}

const entries = [
	['name', 'Vladilen'],
	['age', 26]
	['job', 'Fullstack']
]

console.log(Object.entries(obj))
console.log(Object.fromEntries(entries))

const map = new Map(entries) // создали первую мэпу, теперь эту карту можем использовать далее

console.log(map.get('job')) // ==> Fullstack

map
	.set('newField', 42)
	.set(obj, 'Value of object') // ключами в мэпе могут быть любые значения, в том числе и объекты
	.set(NaN, 'NaN ??')

map.delete('job')
console.log(map.has('job'))
console.log(map.size)
map.clear()
console.log(map.size)

for (let entry of map.entries()) {
	console.log(entry)
}

for (let [key, value] of map) {
	console.log(key, value)
}

for (let val of map.values()) {
	console.log(val)
}

for (let key of map.keys()) {
	console.log(key)
}

map.forEach((val, key, m) => { // тоже самое что и map и он получается на каждой итерации

})

const array = [...map] // делаем массив из карты с помощью оператора spread развернуть карту
console.log(array)
const array = Array.from(map) // можно и так создать массив. Результат будет такой же
// Карта - это усложненный объект
const mapObj = Object.fromEntries(map)

const users = [
	{name: 'Elena'},
	{name: 'Alex'},
	{name: 'Irina'}
]

const visits = new Map()

visits
	.set(users[0], new Date())
	.set(users[1], new Date(new Date().getTime() + 1000 * 60))
	.set(users[1], new Date(new Date().getTime() + 5000 * 60))

function lastVisit(user) {
	return visits.get(user)
}

console.log(lastVisit(users[1]))


// Урок 18. Шаблоны проектирования

// 1. Constructor (creational)
function Server(name, ip) { // функция как класс (заглавная), сможем поэтому применть оператор New. Является конструктором
	this.name = name
	this.ip = ip
}

Server.prototype.getUrl = function() { // создали класс с расширенным прототипом
	return `https://${this.ip}:80`
}

const aws = new Server('AWS German', '82.21.21.32')
console.log(aws.getUrl()) // создаем инстанс данного класса

// формат записи сегодня
class Server {
	constructor(name, ip) {
		this.name = name
		this.ip = ip
	}

	getUrl() {
		return `https://${this.ip}:80`
	}
}

const aws = new Server('AWS German', '82.21.21.32')
console.log(aws.getUrl())

// 2. Factory (creational)
class SimpleMembership {
	constructor(name) {
		this.name = name
		this.cost = 50
	}
}

class StandardMembership {
	constructor(name) {
		this.name = name
		this.cost = 150
	}
}

class PremiumMembership {
	constructor(name) {
		this.name = name
		this.cost = 500
	}
}

class MemberFactory {
	static list = {
		simple: SimpleMembership,
		standard: StandardMembership,
		premium: PremiumMembership
	}

	create(name, type = 'simple') {
		const Membership = MemberFactory.list[type] || MemberFactory.list.simple
		const member = new Membership(name)
		member.type = type
		member.define = function() {
			console.log(`${this.name} (${this.type}): ${this.cost}`)
		}
		return member 
	}
}

const factory = new MemberFactory()

const members = [
	factory.create('Vladilen', 'simple'),
	factory.create('Elena', 'premium'),
	factory.create('Vasilisa', 'standard'),
	factory.create('Ivan', 'premium'),
	factory.create('Petr')
]

console.log(members)

members.forEach( m => {
	m.define()
})

// 3. Prototype (creational)
const car = {
	wheels: 4,

	init() {
		console.log(`У меня есть ${this.wheels} колеса, мой владелец ${this.owner}`)
	}
}

const carWithOwner = Object.create(car, {
	owner: {
		value: 'Дмитрий'
	}
})

console.log(carWithOwner.__proto__ === car)

carWithOwner.init()

// 4. Singleton (creational)
class Database {
	constructor(data) {
		if (Database.exists) {
			return Database.instance
		}
		Database.instance = this // контекст именно этого класса
		Database.exists = true
		this.data = data
	}

	getData() {
		return this.data
	}
}

const mongo = new Database('MongoDB')
console.log(mongo.getData())

const mysql = new Database('MySQL')
console.log(mongo.getData())

// 5. Adapter (structural)
// 29:04
class OldCalc {
	operations (t1, t2, operation) {
		switch (operation) {
			case 'add': return t1 + t2
			case 'sub': return t1 - t2
			default: return NaN
		}
	}
}

class NewCalc {
	add (t1, t2) {
		return t1 + t2
	}

	sub (t1, t2) {
		return t1 - t2
	}
}

class CalcAdapter {
	constructor() {
		this.calc = new NewCalc()
	}

	operations (t1, t2, operation) {
		switch (operation) {
			case 'add': return t1 + t2
			case 'sub': return t1 - t2
			default: return NaN
	}
}

const oldCalc = new OldCalc()
console.log(oldCalc.operations(10, 5, 'add'))

const newCalc = new NewCalc()
console.log(newCalc.add(10, 5))

const adapter = new CalcAdapter()
console.log(adapter.operations(25, 10, 'sub'))
// 35:39

// 6. Decorator design pattern (structural)
class Server {
	constructor(ip, port) {
		this.ip = ip
		this.port = port
	}

	get url() {
		return `https://${this.ip}:${this.port}`
	}
}

function aws(server) {
	server.isAWS = true
	server.awsInfo = function() {
		return server.url // getter
	}
	return server
}

function azure(server) {
	server.isAzure = true
	server.port += 500
	return server
}

const s1 = aws(new Server('12.34.56.78', 8080))
console.log(s1.isAWS)
console.log(s1.awsInfo())

const s2 = azure(new Server('98.87.76.12', 1000))
console.log(s2.isAzure)
console.log(s2.url)
// 41:26

// 7. Facade
class Complaints {
	constructor() {
		this.complaints = []
	}

	reply(complaint) {}

	add(complaint) {
		this.complaints.push(complaint)
		return this.reply(complaint)
	}
}

class ProductComplaints extends Complaints {
	reply({id, customer, details}) {
		return `Product: ${id}: ${customer} (${details})`
	}
}

class SericeComplaints extends Complaints {
	reply({id, customer, details}) {
		return `Service: ${id}: ${customer} (${details})`
	}
}

class ComplaintRegistry {
	register(customer, type, details) {
		const id = Date.now()
		let ComplaintRegistry

		if (type === 'service') {
			complaint = new ServiceComplaints()
		} else {
			complaint = new ProductComplaints()
		}

		return complaint.add({id, customer, details}))
	}
}

const registry = new ComplaintRegistry()

console.log(registry.register('Vladilen', 'service', 'недоступен'))
console.log(registry.register('Elena', 'product', 'вылазит ошибка'))
// 50:37

// 8. Flyweight
// служит для эффективной передачи данных через различные типы объектов
// загрузка изображений в браузерах - паттерн используется, чтобы не загружать изображение дважды
// кеширование, сохранение в памяти и прочее
class Car {
	constructor(model, price) {
		this.model = model
		this.price = price
	}
}

class CarFactory {
	constructor() {
		this.cars = []
	}

	create(model, price) {
		const candidate = this.getCar(model)
		if (candidate) {
			return candidate
		}

		const newCar = new Car(model ,price)
		this.cars.push(newCar)
		return newCar
	}

	getCar(model) {
		return this.cars.find(car => car.model === model)
	}
}

const factory = new CarFactory()

const bmwX6 = factory.create('bmw', 10000)
const audi = factory.create('audi', 12000)
const bmwX3 = factory.create('bmw', 8000)

console.log(bmwX3 === bmwX6);
// 57:08

// 9. Proxy
// позволяет ставить ловушки на поля объектов, на вызов функции
// избавление от лишних запросов на сервер - как пример
function networkFetch(url) {
	return `${url} - Ответ от сервера`
}

const cache = new Set()
const proxiedFetch = new Proxy(networkFetch, {
	apply(target, thisArg, args) {
		const url = args[0]
		if (cache.has(url)) {
			return `${url} - Ответ из кеша`
		} else {
			cache.add(url)
			return Reflect.apply(target, thisArg, args)
		}
	}
})

console.log(proxiedFetch('angular.io')) // ответ от сервера
console.log(proxiedFetch('react.io')) // ответ от сервера
console.log(proxiedFetch('angular.io')) // ответ из кэша

// 10. Chain of responsibility (Behaviour)
// позволяет последовательно у одного и того же объекта вызывать какой-то набор операций
// и последовательно их модифицировать - библиотеке jQuery в пример

class MySum {
	constructor(initialValue = 42) {
		this.sum = initialValue
	}

	add(value) {
		this.sum += value
		return this
	}
}

const sum1 = new MySum()
console.log(sum1.add(8).add(10).add(1).add(9).sum)

const sum2 = new MySum(0)
console.log(sum2.add(1).add(2).add(3).sum)

// 11. Command
// Redux является характерным примером

class MyMath {
	constructor(initialValue = 0) {
		this.num = initialValue
	}

	square() {
		return this.num ** 2
	}

	cube() {
		return this.num ** 3
	}
}

class Command {
	constructor(subject) {
		this.subject = subject
		this.commandsExecuted = []
	}

	execute() {
		this.commandsExecuted.push(command)
		return this.subject[command]()
	}
}

const x = new Command (new MyMath(2))
console.log(x.execute('square'))
console.log(x.execute('cube'))
console.log(x.commandsExecuted)
// 01:12:00

// 12. Iterator
// Последовательно получаем доступ до определенной информации
class MyIterator {
	constructor(data) {
		this.index = 0
		this.data = data
	}

	[Symbol.iterator]() {
		return {
			next: () => {
				if (this.index < this.data.length) {
					return {
						value: this.data[this.index++],
						done: false
					}
				} else {
					this.index = 0
					return {
						done: true,
						value: void 0
					}
				}
			}
		}
	}
}

function* generator(collection) {
	let index = 0

	while (index < collection.length) {
		yield collection[index++]
	}
}

const iterator = new MyIterator(['This', 'is', 'iterator'])
const gen = generator(['This', 'is', 'iterator'])

for (const val of iterator) {
	console.log('Value: ', val)
}

for (const val of gen) {
	console.log('Value: ', val)
}

console.log(gen.next().value)
console.log(gen.next().value)
console.log(gen.next().value)
console.log(gen.next().value) // undefined
// 1:18:25

// 13. Mediator
// Коммуникация между объектами разного типа
class User {
	constructor(name) {
		this.name = name
		this.room = null
	}

	send(message, to) {
		this.room.send(message, this, to)
	}

	receive(message, from) {
		console.log(`${from.name} => ${this.name}: ${message}`)
	}
}

class ChatRoom {
	constructor() {
		this.users = {}
	}

	register(user) {
		this.users[user.name] = user
		user.room = this
	}

	send(message, from, to) {
		if (to) {
			to.receive(message, from)
		} else {
			Object.keys(this.users).forEach(key => {
				if (this.users[key] !== from) {
					this.users[key].receive(message, from)
				}
			})
		}
	}
}

const vlad = new User('Vladilen')
const lena = new User('Elena')
const igor = new User('Igor')

const room = new ChatRoom()

room.register(vlad)
room.register(lena)
room.register(igor)

vlad.send('Hello!', lena)
lena.send('Hello hello!', vlad)
igor.send('Vsem privet')
// 1:25:58

// 14. Observer OR Publisher Subscriber OR Despatcher OR Listener
// Формирует зависимости типа "один ко многим" - one to many dependencies
// У нас есть объект, у которого мы можем стриггерить вызов изменений
// Все объекты, подписанные на эти изменения, получают эти обновления и делают свой функционал
class Subject {
	constructor() {
		this.observers = []
	}

	subscribe(observer) {
		this.observers.push(observer)
	}

	unsubscribe(observer) {
		this.observers = this.observers.filter(obs => obs !== observer)
	}

	fire(action) {
		this.observers.forEach(observer => {
			observer.update(action)
		})
	}
}

class Observer {
	constructor(state = 1) {
		this.state = state
		this.initialState = state
	}

	update(action) {
		switch (action.type) {
			case 'INCREMENT':
				this.state = ++this.state
				break
			case 'DECREMENT':
				this.state = --this.state
				break
			case 'ADD':
				this.state += action.payload
				break
			default: 
				this.state = this.initialState
		}
	}
}

const stream$ = new Subject()

const obs1 = new Observer()
const obs2 = new Observer(42)

stream$.subscribe(obs1)
stream$.subscribe(obs2)

stream$.fire({type: 'INCREMENT'})
stream$.fire({type: 'INCREMENT'})
stream$.fire({type: 'DECREMENT'})
stream$.fire({type: 'ADD'})

console.log(obs1.state)
console.log(obs2.state)
// 1:36:12

// 15. State
class Light {
	constructor(light) {
		this.light = light
	}
}

class RedLight extends Light {
	constructor() {
		super('red')
	}

	sign() {
		return 'СТОП!'
	}
}

class YellowLight extends Light {
	constructor() {
		super('yellow')
	}

	sign() {
		return 'ГОТОВЬСЯ!'
	}
}

class GreenLight extends Light {
	constructor() {
		super('green')
	}

	sign() {
		return 'ЕДЬ!'
	}
}

class TrafficLight {
	constructor() {
		this.states = [
			new RedLight,
			new YellowLight,
			new GreenLight
		]
		this.current = this.states[0]
	}

	change() {
		const total = this.states.length
		let index = this.states.findIndex(light => light === this.current)

		if (index + 1 < total) {
			this.current = this.states[index + 1]
		} else {
			this.current = this.states[0]
		}
	}

	sign() {
		return this.current.sign()
	}
}

const traffic = new TrafficLight()
console.log(traffic.sign())
traffic.change()

console.log(traffic.sign())
traffic.change()

console.log(traffic.sign())
traffic.change()
// 1:43:38