
/* Implement a doubly linked list. */

function List () {
  this.firstElement = null;
  this.lastElement = null;

  this.push = function (val) {
    new Node(val, this, 1);
  };

  this.unshift = function (val) {
    new Node(val, this, 0);
  };

  this.pop = function () {
    if (this.lastElement === null) {return undefined};

    let result = this.lastElement.value;

    if (this.lastElement.prev === null) {
      this.lastElement = null;
      this.firstElement = null;
    } else {
      this.lastElement = this.lastElement.prev;
      this.lastElement.next = null;
    };

    return result;
  };

  this.shift = function () {
    if (this.firstElement === null) {
      return undefined;
    };

    let result = this.firstElement.value;

    if (this.firstElement.next === null) {
      this.lastElement = null;
      this.firstElement = null;
    } else {
      this.firstElement = this.firstElement.next;
      this.firstElement.prev = null;
    }

    return result;
  };

  this.count = function () {
    let result = 0;
    if (this.firstElement === null) {
      return result;
    } else {
      return plusNode(this.firstElement, result);
    }
  };

  this.delete = function (val) {
    if (this.firstElement === null) {
      return undefined;
    } else if (this.firstElement.value === val) {
      this.shift();
      return;
    } else if (this.lastElement.value === val) {
      this.pop();
      return;
    } else {
      compareNode(this.firstElement.next, val);
    };    
  };
}

/* Recursive function for List.count() */
function plusNode (obj, result) {
  result += 1;
  if (obj.next === null) {
    return result;
  } else {
    result = plusNode(obj.next, result);
  };
  return result;
};

/* Recursive function for List.delete() */
function compareNode(obj, val) {
  if (obj.value === val) {

    if (obj.next !== null) {
      obj.next.prev = obj.prev;
      obj.prev.next = obj.next;
    } 
    
    return;
  } else {
    if (obj.next !== null) {
      compareNode(obj.next, val);
    } else return undefined;
  } 
};

function Node (val, context, place) {
  // context is the List instance
  // place is 0 for unshift, 1 for push
  this.value = val;

  /* for unshift */
  if (place === 0) {
    this.prev = null;

    if (context.firstElement === null) {
      this.next = null;
      context.firstElement = this;
      context.lastElement = this;
    } else {
      this.next = context.firstElement;
      context.firstElement.prev = this;
      context.firstElement = this;
    };    
  };

  /* for push */
  if (place === 1) {
    this.prev = context.lastElement;
    this.next = null;

    if (context.firstElement === null) {context.firstElement = this};
    if (context.lastElement !== null) {context.lastElement.next = this};

    context.lastElement = this;
  };
};

const example = new List();

example.push(5);
example.push(6);
example.push(7);

// example.delete(6);
// example.unshift(4);
// console.log(example.shift());
// console.log(example.pop());

console.log(example.count());
console.log(example);
