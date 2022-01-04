
/* Write a JavaScript function to get a copy of the object where the keys have become the values and the values the keys. (objects have string, number values or another object with string and number values) */

const obj = {
    name: "Jhon",
    country: {
        name: "Armenia",
        code: 374,
        more: {
            region: 'Yerevan',
            street: 'Mashtoc'
        }
    }
};

function reverseObj (obj) {
    let newObj = {};

    for (prop in obj) {
        let propNameSaver = prop;

        if (obj[prop] instanceof Object) {
            /* reversing props, that are objects */
            newObj[propNameSaver] = reverseObj(obj[prop]);
        } else {
            newObj[obj[prop]] = prop;
        };
    };
    return newObj;
}

console.log(reverseObj(obj));