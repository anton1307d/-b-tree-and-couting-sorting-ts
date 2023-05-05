import BTree from "../b-tree";
import * as fs from 'fs';

export default function measureTimeComplexityDelete() {
    const times = [];
    const bTree = new BTree(2);

    bTree.insert(0);
    bTree.insert(1);

    for (let i = 1; i < 2000; i += 1) {
        const init = performance.now();
        bTree.delete(i);
        const end = performance.now();

        times.push(end - init);
        bTree.insert(i);
        bTree.insert(i + 1);
    }

    const csv = times.map((time, i) => `${time},${i}`).join('\n');
    fs.writeFileSync('time-complexity-delete.csv', csv);
}