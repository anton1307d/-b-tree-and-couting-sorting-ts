import BTree from "../b-tree";
import * as fs from 'fs';

export default function measureTimeComplexitySearch() {
    const times = [];
    const bTree = new BTree(2);

    bTree.insert(0);
    bTree.insert(1);

    for (let i = 1; i < 2000; i += 1) {
        bTree.insert(i);
        const init = performance.now();
        bTree.searchValue(bTree.root, i);
        times[i] = performance.now() - init;
    }

    const csv = times.map((time, i) => `${time},${i}`).join('\n');
    fs.writeFileSync('time-complexity-search.csv', csv);
}
