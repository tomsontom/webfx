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
        private x : number;
        private y : number;


        constructor();
        constructor(x : number, y : number);
        constructor(x? : number, y? : number) {
            super();
            this.x = x;
            this.y = y;
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

        addTo(pgPath: svgscene.shape.NSVGPath): void {
        }
    }

    export class HLineTo extends PathElement {

        addTo(pgPath: svgscene.shape.NSVGPath): void {
        }
    }

    export class VLineTo extends PathElement {

        addTo(pgPath: svgscene.shape.NSVGPath): void {
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