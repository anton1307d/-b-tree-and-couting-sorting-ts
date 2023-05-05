import {BTreeNode} from "./b-tree.node";

export default class BTree {

    public order: number;
    public root: BTreeNode;

    constructor(order: number) {
        this.order = order;
        this.root = new BTreeNode(true);
    }

    insert(value: number): void {
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

    searchValue(node: BTreeNode, value: number): BTreeNode|null {
        if (node.values.includes(value)) {
            return node;
        }
        if (node.leaf) {
            return null;
        }
        let child = 0;
        while (child <= node.n && node.values[child] < value) {
            child++;
        }
        return this.searchValue(node.children[child], value);
    }

    delete(value: number): void {
        if (this.root.n === 1 && !this.root.leaf &&
            this.root.children[0].n === this.order-1 && this.root.children[1].n === this.order -1
        ) {
            this.mergeNodes(this.root.children[1], this.root.children[0]);
            this.root = this.root.children[0];
        }



        this.deleteFromNode(this.root, value);
    }

    deleteFromNode(node: BTreeNode, value: number) {

        if (!node) {
            return ;
        }

        const index = node.values.indexOf(value);

        if (index >= 0) {

            if (node.leaf && node.n > this.order - 1) {
                node.removeValue(node.values.indexOf(value));
                return true;
            }

            if (node.children[index].n > this.order - 1 ||
                node.children[index + 1].n > this.order - 1) {
                if (node.children[index].n > this.order - 1) {

                    const predecessor = this.getMinMaxFromSubTree(node.children[index], 1);
                    node.values[index] = predecessor;
                    return this.deleteFromNode(node.children[index], predecessor);
                }
                const successor = this.getMinMaxFromSubTree(node.children[index+1], 0);
                node.values[index] = successor;
                return this.deleteFromNode(node.children[index+1], successor);
            }

            this.mergeNodes(node.children[index + 1], node.children[index]);
            return this.deleteFromNode(node.children[index], value);
        }

        if (node.leaf) {
            return false;
        }

        let nextNode = 0;
        while (nextNode < node.n && node.values[nextNode] < value) {
            nextNode++;
        }
        if (node.children[nextNode].n > this.order - 1) {
            return this.deleteFromNode(node.children[nextNode], value);
        }

        if ((nextNode > 0 && node.children[nextNode - 1].n > this.order - 1) ||
            (nextNode < node.n && node.children[nextNode + 1].n > this.order - 1)) {

            if (nextNode > 0 && node.children[nextNode - 1].n > this.order - 1) {
                this.transferValue(node.children[nextNode - 1], node.children[nextNode]);
            } else {
                this.transferValue(node.children[nextNode + 1], node.children[nextNode]);
            }
            return this.deleteFromNode(node.children[nextNode], value);
        }

        this.mergeNodes(
            nextNode > 0 ? node.children[nextNode - 1] : node.children[nextNode + 1],
            node.children[nextNode]);
        return this.deleteFromNode(node.children[nextNode], value);
    }

    transferValue(origin: BTreeNode, target: BTreeNode): void {

        const indexo = origin.parent?.children.indexOf(origin);
        const indext = origin.parent?.children.indexOf(target);

        if (indexo < indext) {
            target.addValue(target.parent.removeValue(indexo));
            origin.parent?.addValue(origin.removeValue(origin.n-1));
            if (!origin.leaf) {
                target.addChild(origin.deleteChild(origin.children.length-1), 0);
            }
        } else {
            target.addValue(target.parent.removeValue(indext));
            origin.parent?.addValue(origin.removeValue(0));
            if (!origin.leaf) {
                target.addChild(origin.deleteChild(0), target.children.length);
            }
        }
    }

    mergeNodes(origin: BTreeNode, target: BTreeNode) {

        if (!origin.parent || !target.parent) {
            return;
        }

        const indexo = origin.parent.children.indexOf(origin);
        const indext = target.parent.children.indexOf(target);

        target.addValue(target.parent.removeValue(Math.min(indexo, indext)));

        for (let i = origin.n - 1; i >= 0; i--) {
            target.addValue(origin.removeValue(i));
        }

        target.parent.deleteChild(indexo);

        if (!origin.leaf) {
            while (origin.children.length) {
                if (indexo > indext) {
                    target.addChild(origin.deleteChild(0), target.children.length);
                } else {
                    target.addChild(origin.deleteChild(origin.children.length - 1), 0);
                }
            }
        }
    }

    getMinMaxFromSubTree(node: BTreeNode, max: 0|1): number {
        while (!node.leaf) {
            node = node.children[max ? node.n : 0];
        }
        return node.values[max ? node.n - 1 : 0];
    }

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
