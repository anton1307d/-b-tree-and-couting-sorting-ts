import {BTreeNode} from "./b-tree.node";

export default class BTree {

    public order: number;
    public root: BTreeNode;

    constructor(order: number) {
        this.order = order;
        this.root = new BTreeNode(true);
    }

    insert(value: number) {
        const actual = this.root;
        if (actual.n === 2 * this.order - 1) {

            const temp = new BTreeNode(false);
            temp.tree = this;
            this.root = temp;
            temp.addChild(actual, 0);
            this.split(actual, temp, 1);
            this.insertNonFull(temp, value);

        } else {
            this.insertNonFull(actual, value);
        }
    };

    split(child: BTreeNode, parent: BTreeNode, pos: number): void {
        const newChild = new BTreeNode(child.leaf);
        newChild.tree = this.root.tree;

        for (let k = 1; k < this.order; k++) {
            newChild.addValue(child.removeValue(this.order));
        }

        if (!child.leaf) {
            for (let k = 1; k <= this.order; k++) {
                newChild.addChild(child.deleteChild(this.order), k - 1);
            }
        }

        parent.addChild(newChild, pos);
        parent.addValue(child.removeValue(this.order - 1));
        parent.leaf = false;
    }

    insertNonFull(node: BTreeNode, value: number): void {
        if (node.leaf) {
            node.addValue(value);
            return;
        }
        let temp = node.n;
        while (temp >= 1 && value < node.values[temp - 1]) {
            temp = temp - 1;
        }
        if (node.children[temp].n === 2 * this.order - 1) {
            this.split(node.children[temp], node, temp + 1);
            if (value  > node.values[temp]) {
                temp = temp + 1;
            }
        }
        this.insertNonFull(node.children[temp], value);
    }
}
