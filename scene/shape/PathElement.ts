namespace scene.shape {

    export abstract class PathElement {

        impl_nodes : Node[] = [];
        absolute   : boolean;


        addNode(n : Node) : void{
            this.impl_nodes.push(n);
        }

        removeNode(n : Node) : void{
            let i = this.impl_nodes.indexOf(n);
            if (i > -1) {
                this.impl_nodes.splice(i, 1);
            }
        }

        u() : void {
            this.impl_nodes.forEach((node : Node, i : number) => {
                //node.markPathDirty();
                //node.sync();
            })
        }

        abstract addTo(pgPath : svgscene.shape.NSVGPath) : void;



        //abstract impl_addTo(path : geom.Path2D) : void;

        setAbsolute(value : boolean) {
            this.absolute = value;
            this.u();
        }

        isAbsolute() : boolean{
            return this.absolute == null || this.absolute;
        }

    }

    export class MoveTo extends PathElement {
        static  count : number = 0;
        id            : string;
        private x     : number;
        private y     : number;

        constructor();
        constructor(x : number, y : number);
        constructor(x? : number, y? : number) {
            super();
            this.x  = x;
            this.y  = y;
            this.id = "MoveTo_" + (MoveTo.count++);
        }


        getX() : number { return this.x; }
        setX(x : number) {
            this.x = x;
            this.u();
        }

        getY() : number { return this.y; }
        setY(y : number) {
            this.y = y;
            this.u();
        }

        addTo(pgPath: svgscene.shape.NSVGPath): void {
            if (this.isAbsolute()) {
                pgPath.addMoveTo(this.x, this.y);
            } else {
                pgPath.addMoveTo((pgPath.currentX + this.x), (pgPath.currentY + this.y));
            }
        }

        toString() : string {
            return " M " + this.x + "," + this.y + " ";
        }
    }

    export class LineTo extends PathElement {
        static  count : number = 0;
        id            : string;
        private x     : number;
        private y     : number;


        constructor();
        constructor(x : number, y : number);
        constructor(x? : number, y? : number) {
            super();
            this.x  = x;
            this.y  = y;
            this.id = "LineTo_" + (LineTo.count++);
        }


        getX() : number { return this.x; }
        setX(x : number) {
            this.x = x;
            this.u();
        }

        getY() : number { return this.y; }
        setY(y : number) {
            this.y = y;
            this.u();
        }

        addTo(pgPath: svgscene.shape.NSVGPath): void {
            if (this.isAbsolute()) {
                pgPath.addLineTo(this.x, this.y);
            } else {
                pgPath.addLineTo((pgPath.currentX + this.x), (pgPath.currentY + this.y));
            }
        }

        toString() : string {
            return " L " + this.x + "," + this.y + " ";
        }
    }

    export class HLineTo extends PathElement {
        static  count : number = 0;
        id            : string;
        private x     : number;


        constructor();
        constructor(x : number);
        constructor(x? : number) {
            super();
            this.x  = x;
            this.id = "HLineTo_" + (HLineTo.count++);
        }


        getX() : number { return this.x; }
        setX(x : number) {
            this.x = x;
            this.u();
        }

        addTo(pgPath: svgscene.shape.NSVGPath): void {
            if (this.isAbsolute()) {
                pgPath.addLineTo(this.x, pgPath.currentY);
            } else {
                pgPath.addLineTo((pgPath.currentX + this.x), pgPath.currentY);
            }
        }

        toString() : string {
            return " H " + this.x + " ";
        }
    }

    export class VLineTo extends PathElement {
        static  count : number = 0;
        id            : string;
        private y     : number;


        constructor();
        constructor(y : number);
        constructor(y? : number) {
            super();
            this.y  = y;
            this.id = "VLineTo_" + (VLineTo.count++);
        }


        getY() : number { return this.y; }
        setY(y : number) {
            this.y = y;
            this.u();
        }

        addTo(pgPath: svgscene.shape.NSVGPath): void {
            if (this.isAbsolute()) {
                pgPath.addLineTo(pgPath.currentX, this.y);
            } else {
                pgPath.addLineTo(pgPath.currentX, (pgPath.currentY + this.y));
            }
        }

        toString() : string {
            return " V " + this.y + " ";
        }
    }

    export class QuadCurveTo extends PathElement {

        addTo(pgPath: svgscene.shape.NSVGPath): void {
        }
    }

    export class CubicCurveTo extends PathElement {

        addTo(pgPath: svgscene.shape.NSVGPath): void {
        }
    }

    export class ClosePath extends PathElement {

        addTo(pgPath: svgscene.shape.NSVGPath): void {
        }
    }
}