import BTree from "./b-tree";
import * as fs from 'fs';

const times = [];
const bTree = new BTree(2);

bTree.insert(0);
bTree.insert(1);

for (let i = 1; i < 2000; i += 1) {
    const init = performance.now();
    bTree.insert(i);
    times[i] = performance.now() - init;
}

console.log(times);

const csv = times.map((time, i) => `${time},${i}`).join('\n');
fs.write('times.csv', csv);






