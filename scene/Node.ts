namespace scene {
    export interface NGNode {
        sync();
    }
    export abstract class Node {
        layoutX : number;
        layoutY : number;

        constructor() {
            console.log("Node");
        }

        abstract getNgNode() : NGNode;

        resize(width: number, height: number) {
            this.getNgNode().sync();
        }

        relocate(x: number, y: number) {
            this.layoutX = x;
            this.layoutY = y;
            this.getNgNode().sync();
        }

        resizeRelocate(x: number, y: number, width: number, height: number) {
            this.relocate(x,y);
            this.resize(width,height);
            this.getNgNode().sync();
        }
    }
}
