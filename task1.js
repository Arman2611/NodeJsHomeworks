

/* Write map and slice functions that work like Array.map and Array.slice functions */


let arr1 = [1,2,3,4,5];

/* Custom Map */
function customMap (arr, callback) {
    let newArray = [];
    for (let i = 0; i < arr.length; i++) {
        newArray.push( callback(arr[i]) );
    };
    return newArray;
};
function customCallback (num) {
    return num * num;
};
console.log(customMap(arr1, customCallback));


/* Custom Slice */
function customSlice (arr, start, end) {
    let newArray = [];
    if (!start) { var start = 0};
    if (!end) { var end = arr.length};
    if (start < 0) {
        start = arr.length + start;
    };
    if (end < 0) {
        end = arr.length + end;
    };

    for (let i = 0; i < arr.length; i++) {
        if (i >= start && i < end) {
            newArray.push(arr[i]);
        };
    };
    return newArray;
};
console.log(customSlice(arr1, 0, 4));
console.log(customSlice(arr1, -3, -1));