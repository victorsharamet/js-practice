// Array
// Object
// Set
// Map
// WeakMap, WeakSet

// Linked List
// [value, next] -> [value, next] -> [value, next]

class Node {
	constructor(data, next = null) {
		this.data = data
		this.next = next
	}
}

class LinkedList {
	constructor() {
		this.head = null
		this.tail = null
	}

	append(data) {
		const node = new Node(data)

		if (this.tail) {
			this.tail.next = node
		}

		if(!this.head) {
			this.head = node
		}

		this.tail = node
	}

	prepend(data) {
		const node = new Node(data, this.head)

		this.head = node

		if (!this.tail) {
			this.tail = node
		}
	}

	toArray() {
		const output = []
		let current = this.head
		
		while(current) {
			output.push(current)
			current = current.next
		}

		return output
	}
}

const list = new LinkedList()

list.append('My')
list.append('name')
list.append('Hi')

console.log(list.toArray())
