namespace scene.shape {
    export abstract class PathElement {
        impl_nodes : scene.Node[];
        absolute   : boolean;

        addNode(n : scene.Node) : void {
            this.impl_nodes.push(n);
        }

        removeNode(n : scene.Node) : void {
            let i = this.impl_nodes.indexOf(n);
            if (i > -1) { this.impl_nodes.slice(i, 1); }
        }

        u() : void {
            this.impl_nodes.forEach((node : scene.Node, i : number) => {
                //node.markPathDirty();
                //sync();
            });
        }

        abstract addTo(pgPath : scene.shape.NGPath) : void;

        abstract impl_addTo(path : geom.Path2D) : void;

        isAbsolute() : boolean {
            return this.absolute == null || this.absolute;
        }
        setAbsolute(value : boolean) :void {
            this.absolute = value;
            this.u();
        }

    }

    export class MoveTo extends scene.shape.PathElement {

        private x : number;
        private y : number;


        constructor(x : number, y : number) {
            super();
            this.x = x;
            this.y = y;
        }


        public getX() : number {
            return this.x;
        }
        public setX(x : number) : void {
            this.x = x;
            this.u();
        }

        public getY() : number {
            return this.y;
        }
        public setY(y : number) : void {
            this.y = y;
            this.u();
        }

        addTo(pgPath: scene.shape.NGPath): void {
            if (this.isAbsolute()) {
                pgPath.addMoveTo(this.x, this.y);
            } else {
                pgPath.addMoveTo((pgPath.getCurrentX() + this.x), (pgPath.getCurrentY() + this.y));
            }
        }

        //deprecated
        impl_addTo(path: geom.Path2D): void {
            if (this.isAbsolute()) {
                path.moveTo(this.x, this.y);
            } else {
                path.moveTo((path.currX + this.x), (path.currY + this.y));
            }
        }

        toString() : string {
            return " M " + this.x + "," + this.y + " ";
        }
    }

    export class LineTo extends scene.shape.PathElement{

        private x : number;
        private y : number;


        constructor(x : number, y : number) {
            super();
            this.x = x;
            this.y = y;
        }


        public getX() : number {
            return this.x;
        }
        public setX(x : number) : void {
            this.x = x;
            this.u();
        }

        public getY() : number {
            return this.y;
        }
        public setY(y : number) : void {
            this.y = y;
            this.u();
        }

        addTo(pgPath: scene.shape.NGPath): void {
            if (this.isAbsolute()) {
                pgPath.addLineTo(this.x, this.y);
            } else {
                pgPath.addLineTo((pgPath.getCurrentX() + this.x), (pgPath.getCurrentY() + this.y));
            }
        }

        //deprecated
        impl_addTo(path: geom.Path2D): void {
            if (this.isAbsolute()) {
                path.lineTo(this.x, this.y);
            } else {
                path.lineTo((path.currX + this.x), (path.currY + this.y));
            }
        }

        toString() : string {
            return " L " + this.x + "," + this.y + " ";
        }
    }

    export class HLineTo extends scene.shape.PathElement {

        private x : number;


        constructor(x : number) {
            super();
            this.x = x;
        }


        public getX() : number {
            return this.x;
        }
        setX(x : number) : void {
            this.x = x;
            this.u
        }

        addTo(pgPath : NGPath) : void {
            if (this.isAbsolute()) {
                pgPath.addLineTo(this.x, pgPath.getCurrentY());
            } else {
                pgPath.addLineTo((pgPath.getCurrentX() + this.x), pgPath.getCurrentY());
            }
        }

        //Deprecated
        impl_addTo(path : geom.Path2D) : void{
            if (this.isAbsolute()) {
                path.lineTo(this.x, path.currY);
            } else {
                path.lineTo((path.currX + this.x), path.currY);
            }
        }

        toString() : string {
            return " H " + this.x + " ";
        }
    }

    export class VLineTo extends scene.shape.PathElement {
        private y : number;


        constructor(y : number) {
            super();
            this.y = y;
        }


        public getY() : number {
            return this.y;
        }
        public setY(y : number) : void {
            this.y = y;
            this.u();
        }

        addTo(pgPath : scene.shape.NGPath) : void{
            if (this.isAbsolute()) {
                pgPath.addLineTo(pgPath.getCurrentX(), this.y);
            } else {
                pgPath.addLineTo(pgPath.getCurrentX(), (pgPath.getCurrentY() + this.y));
            }
        }

        //@Deprecated
        impl_addTo(path : geom.Path2D) : void {
            if (this.isAbsolute()) {
                path.lineTo(path.currX, this.y);
            } else {
                path.lineTo(path.currX, (path.currY + this.y));
            }
        }

        toString() : string {
            return " V " + this.y + " ";
        }
    }

    export class QuadCurveTo extends scene.shape.PathElement {

        private controlX : number;
        private controlY : number;
        private x        : number;
        private y        : number;


        constructor(controlX : number, controlY : number, x : number, y : number) {
            super();
            this.controlX = controlX;
            this.controlY = controlY;
            this.x        = x;
            this.y        = y;
        }


        public getControlX() : number {
            return this.controlX;
        }
        public setControlX(controlX : number) : void {
            this.controlX = controlX;
            this.u();
        }

        public getControlY() : number {
            return this.controlY;
        }
        public setControlY(controlY : number) : void {
            this.controlY = controlY;
            this.u();
        }

        public getX() : number {
            return this.x;
        }
        public setX(x : number) : void {
            this.x = x;
            this.u();
        }

        public getY() : number {
            return this.y;
        }
        public setY(y : number) : void {
            this.y = y;
            this.u();
        }

        addTo(pgPath : scene.shape.NGPath) : void{
            if (this.isAbsolute()) {
                pgPath.addQuadTo(this.controlX, this.controlY, this.x, this.y);
            } else {
                let dx : number = pgPath.getCurrentX();
                let dy : number = pgPath.getCurrentY();
                pgPath.addQuadTo((this.controlX + dx), (this.controlY + dy), (this.x + dx), (this.y + dy));
            }
        }

        //Deprecated
        impl_addTo(path : geom.Path2D) : void{
            if (this.isAbsolute()) {
                path.quadTo(this.controlX, this.controlY, this.x, this.y);
            } else {
                let dx : number = path.currX;
                let dy : number = path.currY;
                path.quadTo((this.controlX + dx), (this.controlY + dy), (this.x + dx), (this.y + dy));
            }
        }

        toString() : string {
            return " Q " + this.controlX + "," + this.controlY + "," + this.x + "," + this.y + " ";
        }
    }

    export class CubicCurveTo extends scene.shape.PathElement {

        private controlX1 : number;
        private controlY1 : number;
        private controlX2 : number;
        private controlY2 : number;
        private x         : number;
        private y         : number;


        constructor(controlX1 : number, controlY1 : number, controlX2 : number, controlY2 : number, x : number, y : number) {
            super();
            this.controlX1 = controlX1;
            this.controlY1 = controlY1;
            this.controlX2 = controlX2;
            this.controlY2 = controlY2;
            this.x         = x;
            this.y         = y;
        }


        public getControlX1() : number {
            return this.controlX1;
        }
        public setControlX1(controlX1 : number) : void {
            this.controlX1 = controlX1;
            this.u();
        }

        public getControlY1() : number {
            return this.controlY1;
        }
        public setControlY1(controlY1 : number) : void {
            this.controlY1 = controlY1;
            this.u();
        }

        public getControlX2() : number {
            return this.controlX2;
        }
        public setControlX2(controlX2 : number) : void {
            this.controlX2 = controlX2;
            this.u();
        }

        public getControlY2() : number {
            return this.controlY2;
        }
        public setControlY2(controlY2 : number) : void {
            this.controlY2 = controlY2;
            this.u();
        }

        public getX() : number {
            return this.x;
        }
        public setX(x : number) : void {
            this.x = x;
            this.u();
        }

        public getY() : number {
            return this.y;
        }
        public setY(y : number) : void {
            this.y = y;
            this.u();
        }

        addTo(pgPath : scene.shape.NGPath) : void {
            if (this.isAbsolute()) {
                pgPath.addCubicTo(this.controlX1, this.controlY1,
                    this.controlX2, this.controlY2,
                    this.x, this.y);
            } else {
                let dx = pgPath.getCurrentX();
                let dy = pgPath.getCurrentY();
                pgPath.addCubicTo((this.controlX1 + dx), (this.controlY1 + dy),
                    (this.controlX2 + dx), (this.controlY2 + dy),
                    (this.x + dx), (this.y + dy));
            }
        }

        //Deprecated
        impl_addTo(path : geom.Path2D) : void{
            if (this.isAbsolute()) {
                path.curveTo(this.controlX1, this.controlY1,
                    this.controlX2, this.controlY2,
                    this.x, this.y);
            } else {
                let dx : number = path.currX;
                let dy : number = path.currY;
                path.curveTo((this.controlX1 + dx), (this.controlY1 + dy),
                    (this.controlX2 + dx), (this.controlY2 + dy),
                    (this.x + dx), (this.y + dy));
            }
        }

        toString() : string {
            return " C " + this.controlX1 + "," + this.controlY1 + "," +
                   this.controlX2 + "," + this.controlY2 + "," +
                   this.x + "," + this.y + " ";
        }
    }

    export class ClosePath extends scene.shape.PathElement {

        constructor() {
            super();
        }


        addTo(pgPath : NGPath) : void{
            pgPath.addClosePath();
        }

        //Deprecated
        impl_addTo(path : geom.Path2D) : void{
            path.closePath();
        }

        toString() : string{
            return " Z ";
        }
    }
}