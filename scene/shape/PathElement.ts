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

    export class ArcTo extends PathElement {
        static  count         : number = 0;
        id                    : string;
        private radiusX       : number;
        private radiusY       : number;
        private xAxisRotation : number;
        private x             : number;
        private y             : number;
        private largeArcFlag  : boolean;
        private sweepFlag     : boolean;


        constructor();
        constructor(radiusX : number, radiusY : number, xAxisRotation : number,
        x : number, y : number, largeArcFlag : boolean, sweepFlag : boolean);
        constructor(radiusX? : number, radiusY? : number, xAxisRotation? : number,
                    x? : number, y? : number, largeArcFlag? : boolean, sweepFlag? : boolean) {
            super();
            this.radiusX       = radiusX;
            this.radiusY       = radiusY;
            this.xAxisRotation = xAxisRotation;
            this.x             = x;
            this.y             = y;
            this.largeArcFlag  = largeArcFlag;
            this.sweepFlag     = sweepFlag;
            this.id            = "ArcTo_" + (ArcTo.count++);
        }

        getRadiusX() : number { return this.radiusX; }
        setRadiusX(radiusX : number) {
            this.radiusX = radiusX;
            this.u();
        }

        getRadiusY() { return this.radiusY; }
        setRadiusY(radiusY : number) {
            this.radiusY = radiusY;
            this.u();
        }

        getXAxisRotation() { return this.xAxisRotation; }
        setXAxisRotation(xAxisRotation : number) {
            this.xAxisRotation = xAxisRotation;
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

        isLargeArcFlag() : boolean { return this.largeArcFlag; }
        setLargeArcFlag(largeArcFlag : boolean) {
            this.largeArcFlag = largeArcFlag;
            this.u();
        }

        isSweepFlag() : boolean { return this.sweepFlag; }
        setSweepFlag(sweepFlag : boolean) {
            this.sweepFlag = sweepFlag;
            this.u();
        }

        addTo(pgPath: svgscene.shape.NSVGPath) : void {
            this.addArcTo(pgPath, pgPath.getCurrentX(), pgPath.getCurrentY());
        }

        addArcTo(pgPath: svgscene.shape.NSVGPath, x0 : number, y0 : number): void {
            let localX            : number  = this.x;
            let localY            : number  = this.y;
            let localSweepFlag    : boolean = this.sweepFlag;
            let localLargeArcFlag : boolean = this.largeArcFlag;

            // Determine target "to" position
            let xto : number = this.absolute ? localX : localX + x0;
            let yto : number = this.absolute ? localY : localY + y0;
            // Compute the half distance between the current and the final point
            let dx2 : number = (x0 - xto) / 2.0;
            let dy2 : number = (y0 - yto) / 2.0;
            // Convert angle from degrees to radians
            let xAxisRotationR : number = util.Utils.toRadians(this.xAxisRotation);
            let cosAngle       : number = Math.cos(xAxisRotationR);
            let sinAngle       : number = Math.sin(xAxisRotationR);

            //
            // Step 1 : Compute (x1, y1)
            //
            let x1  : number = ( cosAngle * dx2 + sinAngle * dy2);
            let y1  : number = (-sinAngle * dx2 + cosAngle * dy2);
            // Ensure radii are large enough
            let rx  : number = Math.abs(this.radiusX);
            let ry  : number = Math.abs(this.radiusY);
            let Prx : number = rx * rx;
            let Pry : number = ry * ry;
            let Px1 : number = x1 * x1;
            let Py1 : number = y1 * y1;
            // check that radii are large enough
            let radiiCheck : number = Px1/Prx + Py1/Pry;
            if (radiiCheck > 1.0) {
                rx = Math.sqrt(radiiCheck) * rx;
                ry = Math.sqrt(radiiCheck) * ry;
                if (rx == rx && ry == ry) {/* not NANs */} else {
                    pgPath.addLineTo(xto, yto);
                    return;
                }
                Prx = rx * rx;
                Pry = ry * ry;
            }

            //
            // Step 2 : Compute (cx1, cy1)
            //
            let sign : number = ((localLargeArcFlag == localSweepFlag) ? -1.0 : 1.0);
            let sq   : number = ((Prx*Pry)-(Prx*Py1)-(Pry*Px1)) / ((Prx*Py1)+(Pry*Px1));
            sq = (sq < 0.0) ? 0.0 : sq;
            let coef : number = (sign * Math.sqrt(sq));
            let cx1  : number = coef * ((rx * y1) / ry);
            let cy1  : number = coef * -((ry * x1) / rx);

            //
            // Step 3 : Compute (cx, cy) from (cx1, cy1)
            //
            let sx2 : number = (x0 + xto) / 2.0;
            let sy2 : number = (y0 + yto) / 2.0;
            let cx  : number = sx2 + (cosAngle * cx1 - sinAngle * cy1);
            let cy  : number = sy2 + (sinAngle * cx1 + cosAngle * cy1);

            //
            // Step 4 : Compute the angleStart (angle1) and the angleExtent (dangle)
            //
            let ux : number = (x1 - cx1) / rx;
            let uy : number = (y1 - cy1) / ry;
            let vx : number = (-x1 - cx1) / rx;
            let vy : number = (-y1 - cy1) / ry;
            // Compute the angle start
            let n  : number = Math.sqrt((ux * ux) + (uy * uy));
            let p  : number = ux; // (1 * ux) + (0 * uy)
            sign = ((uy < 0.0) ? -1.0 : 1.0);
            let angleStart : number = util.Utils.toDegrees(sign * Math.acos(p / n));

            // Compute the angle extent
            n = Math.sqrt((ux * ux + uy * uy) * (vx * vx + vy * vy));
            p = ux * vx + uy * vy;
            sign = ((ux * vy - uy * vx < 0.0) ? -1.0 : 1.0);
            let angleExtent : number = util.Utils.toDegrees(sign * Math.acos(p / n));
            if (!localSweepFlag && (angleExtent > 0)) {
                angleExtent -= 360.0;
            } else if (localSweepFlag && (angleExtent < 0)) {
                angleExtent += 360.0;
            }
            angleExtent = angleExtent % 360;
            angleStart = angleStart % 360;

            //
            // We can now build the resulting Arc2D
            //
            let arcX      : number = (cx - rx);
            let arcY      : number = (cy - ry);
            let arcW      : number = (rx * 2.0);
            let arcH      : number = (ry * 2.0);
            let arcStart  : number = -angleStart;
            let arcExtent : number = -angleExtent;

            pgPath.addArcTo(arcX, arcY, arcW, arcH, arcStart, arcExtent, xAxisRotationR);
        }

        toString() : string {
            return " A " + this.radiusX + "," + this.radiusY + "," + this.xAxisRotation + "," + this.largeArcFlag ? "1" : "0" + "," + this.sweepFlag ? "1" : "0" + "," + this.x + "," + this.y + " ";
        }
    }

    export class ClosePath extends PathElement {

        addTo(pgPath: svgscene.shape.NSVGPath): void {
            pgPath.addClosePath();
        }

        toString() : string {
            return " Z ";
        }
    }
}