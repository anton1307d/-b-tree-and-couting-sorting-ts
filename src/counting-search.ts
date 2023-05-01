function countingSort(arr: Array<string>): Array<string> {
    const n = arr.length;

    // The output character array that will have sorted arr
    const output: string[] = new Array(n).fill("");

    const count: number[] = new Array(256).fill(0);

    for (let i = 0; i < n; ++i) {
        ++count[arr[i].charCodeAt(0)];
    }

    for (let i = 1; i <= 255; ++i) {
        count[i] += count[i - 1];
    }

    for (let i = n - 1; i >= 0; i--) {
        output[count[arr[i].charCodeAt(0)] - 1] = arr[i];
        --count[arr[i].charCodeAt(0)];
    }

    for (let i = 0; i < n; ++i) {
        arr[i] = output[i];
    }

    return arr;
}

const arr = ['x', 'y', 'a', 'a', 'b', 'f', 'o', 'f', 'a', 'a', 'e', 'k', 's'];

const sortedArr = countingSort(arr);

console.log("Sorted character array is ", sortedArr.join(""));

