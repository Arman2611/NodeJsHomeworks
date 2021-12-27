

/* Write a program to flatten an array. */

const array = [1,[2,3,[4]],[[5,6],7]];

function customFlat (arr) {
    let newArr = [];

    /* single level flatting */
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] instanceof Array) {
            newArr = newArr.concat(...arr[i]);
        } else {
            newArr = newArr.concat(arr[i]);
        };
    };

    /* checking for need of flatting more levels */
    for (var i = 0; i < newArr.length; i++) {
        if (newArr[i] instanceof Array) {
            return customFlat(newArr);
            break;
        };
    };
    
    return newArr;
}

console.log(customFlat(array));