import BTree from "./b-tree";

export class BTreeNode {

    public leaf: boolean;
    public children: Array<BTreeNode>;
    public values: Array<number>;
    public tree: BTree|null;
    public parent: BTreeNode|null;

    constructor(isLeaf: boolean) {
        this.values = [];
        this.leaf = isLeaf;
        this.children = [];
        this.tree = null;
        this.parent = null;
    }

    public get n(): number {
        return this.values.length;
    }

    public addValue(value: number): void {

        let pos = 0;

        while (pos < this.n && this.values[pos] < value) {
            pos++;
        }

        this.values.splice(pos, 0, value);
    }

    public removeValue(pos: number): number {
        if (pos >= this.n) {
            return -1;
        }

        return this.values.splice(pos, 1)[0];
    }

    public addChild(node: BTreeNode, pos: number) {
        this.children.splice(pos, 0, node);
        node.parent = this;
    }

    public deleteChild(pos: number): BTreeNode {
        return this.children.splice(pos, 1)[0];
    }

}