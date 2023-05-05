import BTree from "../b-tree";
import * as fs from 'fs';

export default function measureSpaceComplexityInsert() {
    let count = 0;
    const sizes = [];

    const bTree = new BTree(2);

    bTree.insert(0);
    bTree.insert(1);

    for (let i = 10; i < 1000; i += 10) {
        count += 1;
        bTree.insert(i);
        const size = sizeof(bTree);
        sizes.push(size);
    }

    const csv = sizes.map((size, i) => `${size},${i}`).join('\n');

    fs.writeFileSync('measure-space-complexity-insert.csv', csv);
}

function sizeof(object: object): number {
    let objectList = [],
        stack = [ object ],
        bytes = 0,
        value,
        i;

    while (stack.length) {
        value = stack.pop();

        if (typeof value === 'boolean') {
            bytes += 4;
        } else if (typeof value === 'string') {
            bytes += value.length * 2;
        } else if (typeof value === 'number') {
            bytes += 8;
        } else if (typeof value === 'object'
            && objectList.indexOf(value) === -1) {
            objectList.push(value);

            for (i in value) {
                if (value.hasOwnProperty(i)) {
                    stack.push(value[i]);
                }
            }
        }
    }
    return bytes;
}

