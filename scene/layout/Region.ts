/// <reference path="./../Parent.ts" />

namespace scene.layout {
    export interface NGRegion extends NGParent {
        syncChildren();
    }

    export class Region extends Parent {
        width : number;
        height : number;
        background: Background;
        ng : NGRegion;
        children : Node[] = []; //FIXME Not correct children are not public and are on Parent
        constructor() {
            super();
            this.ng = new svgscene.layout.NSVGRegion(this);
            console.log("Region");
        }
        setBackground(background : Background) {
            this.background = background;
            this.ng.sync();
        }
        resize(width: number, height: number) {
            console.log("Resize: ", width, " x ", height);
            this.width = width;
            this.height = height;
            this.ng.sync();
        }
        addChild(node : Node) {
            this.children.push(node);
            this.ng.syncChildren();
        }

        getNgNode() {
            return this.ng;
        }

        layoutChildren() {
            this.ng.syncChildren();
        }
    }
}