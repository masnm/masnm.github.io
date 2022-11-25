// this is a queue class wich is used by the bfs algorithm
// the bfs algithm use it by simply creating a object of it and
// using the methods associated with it
class queue {
	// this is a constructor of this queue class wich takes
	// no argument but sets up an empty object of the queue
	constructor() {
		this.elements = {};
		this.head = 0;
		this.tail = 0;
	}
	// this method take an object as argument and push that object
	// in the end of the queue object
	push ( element ) {
		this.elements[this.tail] = element;
		this.tail++;
	}
	// this method take no arguemnt but return the first elemnt
	// of the queue as a return value
	pop () {
		const item = this.elements[this.head];
		delete this.elements[this.head];
		this.head++;
		return item;
	}
	// this method does not change the object but return the
	// front element of the queue object as return value
	front () {
		return this.elements[this.head];
	}
	// this is a getter method wich return the current size
	// ie element count of the queue object
	get size () {
		return this.tail - this.head;
	}
	// this is a getter method wich return a boolean
	// indicating is the queue empty or not
	get empty () {
		return this.length === 0;
	}
}
