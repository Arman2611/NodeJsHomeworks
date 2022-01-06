
/* Implement a doubly linked list. */

class List {  
  constructor() {
    this.firstElement = null;
    this.lastElement = null;
    this.length = 0;
  }  

  count() {
    return this.length;
  }


  /* ------------------------ Push method ------------------------ */
  push(num) {
    this[this.length] = {
      value: num,
      prev: this.lastElement,
      next: null
    };

    this.length += 1;

    if(this.firstElement === null) {
        this.firstElement = this[this.length - 1];
    };

    if(this.lastElement !== null) {
        this.lastElement.next = this[this.length - 1];
    };

    this.lastElement = this[this.length - 1];
  }


  /* ------------------------ Pop method ------------------------ */
  pop() {
    if (this.length === 1) {
      let result = this.lastElement.value;

      delete this[0];
      this.firstElement = null;
      this.lastElement = null;
      this.length = 0;

      return result;

    } else if (this.length > 0) {
      let result = this.lastElement.value;

      this.lastElement.prev.next = null;

      this.lastElement = {
        ...this.lastElement.prev
      };

      this.length -= 1;
      delete this[this.length];

      return result;

    } else return undefined;
  }


  /* ------------------------ Unshift method ------------------------ */
  unshift(num) {

      /* raising indexes by 1 */
      for (let i = this.length; i >= 0; i--) {
          this[i] = this[i-1];
      };

      /* Adding element at index 0 */
      this[0] = {
        value: num,
        prev: null,
        next: this[1]
      };

      this.firstElement = this[0];

      this[1].prev = this[0];
      this.length += 1;
  }


  /* ------------------------ Shift method ------------------------ */
  shift() {
    if (this.length === 1) {
      let result = this.lastElement.value;

      delete this[0];
      this.firstElement = null;
      this.lastElement = null;
      this.length = 0;

      return result;

    } else if (this.length > 0) {
      let result = this[0].value;

      this[1].prev = null;

      /* decreasing indexes by 1 */
      for (let i = 1; i <= this.length; i++) {
          this[i-1] = this[i];
      };

      this.firstElement = this[0];

      this.length -= 1;
      delete this[this.length];

      return result;

    } else return undefined;
  }


  /* ------------------------ Delete method ------------------------ */
  delete(val) {
    for (let i = 0; i < this.length; i++) {
      if (this[i].value == val) {

        if (i === 0) {
          this.shift();
          return;
        } else if (i === this.length-1) {
          this.pop();
          return;
        } else {

          /* decreasing indexes by 1 */
          for (let j = i; j < this.length-1; j++) {
            this[j] = {
              ...this[j+1]
            };
          };

          this[this.length - 1] = undefined;

          this[i-1].next = this[i];
          this[i].prev = this[i-1];

          delete this[this.length-1];

          this.length -= 1;
          return;
        }
      } 
    };
    return undefined;
  }
}

const example = new List();

example.push('a');
example.push('b');
example.push('c');

// console.log( example.pop() );

// console.log( example.shift() );

// example.unshift('f');

// example.delete('b');

// console.log( example.count() );

console.log(example);
