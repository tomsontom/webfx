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
        static  count : number = 0;
        id            : string;
        private ctrlX : number;
        private ctrlY : number;
        private x     : number;
        private y     : number;


        constructor();
        constructor(ctrlX : number, ctrlY : number, x : number, y : number);
        constructor(ctrlX? : number, ctrlY? : number, x? : number, y? : number) {
            super();
            this.ctrlX = ctrlX;
            this.ctrlY = ctrlY;
            this.x     = x;
            this.y     = y;
            this.id    = "QuadTo_" + (QuadCurveTo.count++);
        }

        getControlX() : number { return this.ctrlX; }
        setControlX(ctrlX : number) : void {
            this.ctrlX = ctrlX;
            this.u();
        }

        getControlY() : number { return this.ctrlY; }
        setControlY(ctrlY : number) {
            this.ctrlY = ctrlY;
            this.u();
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
                pgPath.addQuadTo(this.getControlX(), this.getControlY(), this.getX(), this.getY());
            } else {
                let dx : number = pgPath.currentX;
                let dy : number = pgPath.currentY;
                pgPath.addQuadTo((this.getControlX() + dx), (this.getControlY() + dy), (this.getX() + dx), (this.getY() + dy));
            }
        }

        toString() : string {
            return " Q " + this.ctrlX + "," + this.ctrlY + "," + this.x + "," + this.y + " ";
        }
    }

    export class CubicCurveTo extends PathElement {
        static  count  : number = 0;
        id             : string;
        private ctrlX1 : number;
        private ctrlY1 : number;
        private ctrlX2 : number;
        private ctrlY2 : number;
        private x      : number;
        private y      : number;


        constructor();
        constructor(ctrlX1 : number, ctrlY1 : number, ctrlX2 : number, ctrlY2 : number, x : number, y : number);
        constructor(ctrlX1? : number, ctrlY1? : number, ctrlX2? : number, ctrlY2? : number, x? : number, y? : number) {
            super();
            this.ctrlX1 = ctrlX1;
            this.ctrlY1 = ctrlY1;
            this.ctrlX2 = ctrlX2;
            this.ctrlY2 = ctrlY2;
            this.x      = x;
            this.y      = y;
            this.id     = "CurveTo_" + (CubicCurveTo.count++);
        }

        getControlX1() : number { return this.ctrlX1; }
        setControlX1(ctrlX1 : number) : void {
            this.ctrlX1 = ctrlX1;
            this.u();
        }

        getControlY1() : number { return this.ctrlY1; }
        setControlY1(ctrlY1 : number) {
            this.ctrlY1 = ctrlY1;
            this.u();
        }

        getControlX2() : number { return this.ctrlX2; }
        setControlX2(ctrlX2 : number) : void {
            this.ctrlX2 = ctrlX2;
            this.u();
        }

        getControlY2() : number { return this.ctrlY2; }
        setControlY2(ctrlY2 : number) {
            this.ctrlY2 = ctrlY2;
            this.u();
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
                pgPath.addCubicTo(this.getControlX1(), this.getControlY1(), this.getControlX2(), this.getControlY2(), this.getX(), this.getY());
            } else {
                let dx : number = pgPath.currentX;
                let dy : number = pgPath.currentY;
                pgPath.addCubicTo((this.ctrlX1 + dx), (this.ctrlY1 + dy), (this.ctrlX2 + dx), (this.ctrlY2 + dy), (this.x + dx), (this.y + dy));
            }
        }

        toString() : string {
            return " C " + this.ctrlX1 + "," + this.ctrlY1 + "," + this.ctrlX2 + "," + this.ctrlY2 + "," + this.x + "," + this.y + " ";
        }
    }

    export class ClosePath extends PathElement {

        addTo(pgPath: svgscene.shape.NSVGPath): void {
            pgPath.addClosePath();
        }
    }
}