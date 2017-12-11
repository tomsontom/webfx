namespace geom {
    export enum CornerPrefix { CORNER_ONLY, MOVE_THEN_CORNER, LINE_THEN_CORNER }

    export interface PathIterator {
        getWindingRule(): number;

        isDone(): boolean;

        next(): void;

        currentSegment(coords: number[]): number;
    }

    export interface PathConsumer2D {
        moveTo(x : number, y : number) : void;
        lineTo(x : number, y : number) : void;
        quadTo(xc : number, yc : number, x : number, y : number) : void;
        curveTo(xc1 : number, yc1 : number, xc2 : number, yc2 : number, x : number, y : number) : void;
        closePath() : void;
        pathDone() : void;
    }

    export abstract class Iterator {
        typeIdx  : number;
        pointIdx : number;
        path     : geom.Path2D;


        constructor(path: Path2D) {
            this.path = path;
        }


        getWindingRule() : number{
            return this.path.getWindingRule();
        }

        isDone() : boolean {
            return (this.typeIdx >= this.path.numTypes);
        }

        next() : void {
            let type = this.path.pointTypes[this.typeIdx++];
            this.pointIdx += Path2D.curvecoords[type];
        }
    }

    export class CopyIterator extends geom.Iterator{
        floatCoords : number[];

        constructor(p2df : Path2D) {
            super(p2df);
            this.floatCoords = p2df.floatCoords;
        }

        currentSegment(coords : number[]) : number {
            let type      = this.path.pointTypes[this.typeIdx];
            let numCoords = Path2D.curvecoords[type];
            if (numCoords > 0) {
                // alternatively copy array
                //coords = this.floatCoords.slice(0);
                for (let i : number = 0; i < numCoords; i++) {
                    coords[i] = this.floatCoords[this.pointIdx + i];
                }
            }
            return type;
        }
    }

    export class TxIterator extends geom.Iterator {
        floatCoords : number[];
        transform   : geom.transform.BaseTransform;

        constructor(p2df : Path2D, tx : geom.transform.BaseTransform) {
            super(p2df);
            this.floatCoords = p2df.floatCoords;
            this.transform   = tx;
        }

        currentSegment(coords : number[]) : number {
            let type      : number = this.path.pointTypes[this.typeIdx];
            let numCoords : number = Path2D.curvecoords[type];
            if (numCoords > 0) {
                this.transform.transform(this.floatCoords, this.pointIdx, coords, 0, numCoords / 2);
            }
            return type;
        }
    }

    export class Path2D extends scene.shape.Shape implements geom.PathConsumer2D {

        public static readonly WIND_EVEN_ODD: number = 0;
        public static readonly WIND_NON_ZERO: number = 1;

        public static readonly SEG_MOVETO: number  = 0;
        public static readonly SEG_LINETO: number  = 1;
        public static readonly SEG_QUADTO: number  = 2;
        public static readonly SEG_CUBICTO: number = 3;
        public static readonly SEG_CLOSE: number   = 4;

        static readonly curvecoords: number[] = [2, 2, 4, 6, 0];

        pointTypes  : number[];
        numTypes    : number;
        numCoords   : number;
        windingRule : number;

        static readonly INIT_SIZE: number  = 20;
        static readonly EXPAND_MAX: number = 500;

        floatCoords: number[];
        moveX: number;
        moveY: number;
        prevX: number;
        prevY: number;
        currX: number;
        currY: number;


        constructor();
        constructor(rule: number)
        constructor(rule : number, initialCapacity : number);
        constructor(rule?: number, initialCapacity?: number) {
            super();
            if (rule && rule >= 0 && rule <= 2) {
                this.setWindingRule(rule);
            } else {
                this.setWindingRule(Path2D.WIND_NON_ZERO);
            }
            this.pointTypes  = [];
            this.floatCoords = [];
        }


        getPoint(coordindex: number): geom.Point2D {
            return new geom.Point2D(this.floatCoords[coordindex], this.floatCoords[coordindex + 1]);
        }

        checkAndGetIntRect(retrect: geom.Rectangle, tolerance: number): boolean {
            // Valid rectangular paths are:
            //     4 segs: MOVE, LINE, LINE, LINE (implicit CLOSE)
            //     5 segs: MOVE, LINE, LINE, LINE, LINE
            //     5 segs: MOVE, LINE, LINE, LINE, CLOSE
            //     6 segs: MOVE, LINE, LINE, LINE, LINE, CLOSE
            if (this.numTypes == 5) {
                if (this.pointTypes[4] != geom.SegmentType.LINE_TO && this.pointTypes[4] != geom.SegmentType.CLOSE) {
                    return false;
                }
            } else if (this.numTypes == 6) {
                if (this.pointTypes[4] != geom.SegmentType.LINE_TO) {
                    return false;
                }
                if (this.pointTypes[5] != geom.SegmentType.CLOSE) {
                    return false;
                }
            } else if (this.numTypes != 4) {
                return false;
            }
            if (this.pointTypes[0] != geom.SegmentType.MOVE_TO) {
                return false;
            }
            if (this.pointTypes[1] != geom.SegmentType.LINE_TO) {
                return false;
            }
            if (this.pointTypes[2] != geom.SegmentType.LINE_TO) {
                return false;
            }
            if (this.pointTypes[3] != geom.SegmentType.LINE_TO) {
                return false;
            }

            let x0: number = (this.floatCoords[0] + 0.5);
            let y0: number = (this.floatCoords[1] + 0.5);
            if (!this.close(x0, this.floatCoords[0], tolerance)) {
                return false;
            }
            if (!this.close(y0, this.floatCoords[1], tolerance)) {
                return false;
            }

            let x1: number = (this.floatCoords[2] + 0.5);
            let y1: number = (this.floatCoords[3] + 0.5);
            if (!this.close(x1, this.floatCoords[2], tolerance)) {
                return false;
            }
            if (!this.close(y1, this.floatCoords[3], tolerance)) {
                return false;
            }

            let x2: number = (this.floatCoords[4] + 0.5);
            let y2: number = (this.floatCoords[5] + 0.5);
            if (!this.close(x2, this.floatCoords[4], tolerance)) {
                return false;
            }
            if (!this.close(y2, this.floatCoords[5], tolerance)) {
                return false;
            }

            let x3: number = (this.floatCoords[6] + 0.5);
            let y3: number = (this.floatCoords[7] + 0.5);
            if (!this.close(x3, this.floatCoords[6], tolerance)) {
                return false;
            }
            if (!this.close(y3, this.floatCoords[7], tolerance)) {
                return false;
            }

            if (this.numTypes > 4 && this.pointTypes[4] == geom.SegmentType.LINE_TO) {
                if (!this.close(x0, this.floatCoords[8], tolerance)) {
                    return false;
                }
                if (!this.close(y0, this.floatCoords[9], tolerance)) {
                    return false;
                }
            }

            if ((x0 == x1 && x2 == x3 && y0 == y3 && y1 == y2) || (y0 == y1 && y2 == y3 && x0 == x3 && x1 == x2)) {
                let x, y, w, h: number;
                if (x2 < x0) {
                    x = x2;
                    w = x0 - x2;
                } else {
                    x = x0;
                    w = x2 - x0;
                }
                if (y2 < y0) {
                    y = y2;
                    h = y0 - y2;
                } else {
                    y = y0;
                    h = y2 - y0;
                }
                if (w < 0) {
                    return false;
                }
                if (h < 0) {
                    return false;
                }

                if (retrect != null) {
                    retrect.setBounds(x, y, w, h);
                }
                return true;
            }
            return false;
        }

        needRoom(needMove : boolean, newCoords : number) : void {
            if (needMove && this.numTypes == 0) {
                throw new SyntaxError("missing initial moveto in path definition");
            }
            let size : number = this.pointTypes.length;
            if (size == 0) {
                this.pointTypes = new byte[2];
            } else if (this.numTypes >= size) {
                let grow : number = size;
                if (grow > Path2D.EXPAND_MAX) {
                    grow = Path2D.EXPAND_MAX;
                }
                this.pointTypes = this.copyOf(this.pointTypes, size+grow);
            }
            size = this.floatCoords.length;
            if (this.numCoords + newCoords > size) {
                let grow : number = size;
                if (grow > Path2D.EXPAND_MAX * 2) {
                    grow = Path2D.EXPAND_MAX * 2;
                }
                if (grow < newCoords) {
                    grow = newCoords;
                }
                this.floatCoords = copyOf(this.floatCoords, size + grow);
            }
        }

        close(ix: number, fx: number, tolerance: number): boolean {
            return (Math.abs(ix - fx) <= tolerance);
        }

        moveTo(x : number, y : number): void {
            if (this.numTypes > 0 && this.pointTypes[this.numTypes - 1] == geom.SegmentType.MOVE_TO) {
                this.floatCoords[this.numCoords-2] = this.moveX = this.prevX = this.currX = x;
                this.floatCoords[this.numCoords-1] = this.moveY = this.prevY = this.currY = y;
            } else {
                this.needRoom(false, 2);
                this.pointTypes[this.numTypes++]   = geom.SegmentType.MOVE_TO;
                this.floatCoords[this.numCoords++] = this.moveX = this.prevX = this.currX = x;
                this.floatCoords[this.numCoords++] = this.moveY = this.prevY = this.currY = y;
            }
        }

        lineTo(x: number, y: number): void {
            this.needRoom(true, 2);
            this.pointTypes[this.numTypes++]   = geom.SegmentType.LINE_TO;
            this.floatCoords[this.numCoords++] = this.prevX = this.currX = x;
            this.floatCoords[this.numCoords++] = this.prevY = this.currY = y;
        }

        quadTo(xc: number, yc: number, x: number, y: number): void {
            this.needRoom(true, 4);
            this.pointTypes[this.numTypes++] = geom.SegmentType.QUAD_TO;
            this.floatCoords[this.numCoords++] = this.prevX = xc;
            this.floatCoords[this.numCoords++] = this.prevY = yc;
            this.floatCoords[this.numCoords++] = this.currX = x;
            this.floatCoords[this.numCoords++] = this.currY = y;
        }

        curveTo(xc1: number, yc1: number, xc2: number, yc2: number, x: number, y: number): void {
            this.needRoom(true, 6);
            this.pointTypes[this.numTypes++] = geom.SegmentType.CURVE_TO;
            this.floatCoords[this.numCoords++] = xc1;
            this.floatCoords[this.numCoords++] = yc1;
            this.floatCoords[this.numCoords++] = this.prevX = xc2;
            this.floatCoords[this.numCoords++] = this.prevY = yc2;
            this.floatCoords[this.numCoords++] = this.currX = x;
            this.floatCoords[this.numCoords++] = this.currY = y;
        }

        closePath(): void {
            if (this.numTypes == 0 || this.pointTypes[this.numTypes - 1] != geom.SegmentType.CLOSE) {
                this.needRoom(true, 0);
                this.pointTypes[this.numTypes++] = geom.SegmentType.CLOSE;
                this.prevX = this.currX = this.moveX;
                this.prevY = this.currY = this.moveY;
            }
        }

        rectCrossings(rxmin : number, rymin : number, rxmax : number, rymax: number) : number {
            let coords : number[] = this.floatCoords;
            let curx, cury, movx, movy, endx, endy : number;

            curx = movx = coords[0];
            cury = movy = coords[1];
            let crossings : number = 0;
            let ci        : number = 2;
            for (let i : number = 1 ; crossings != geom.Shape.RECT_INTERSECTS && i < this.numTypes; i++) {
                switch (this.pointTypes[i]) {
                    case geom.SegmentType.MOVE_TO:
                        if (curx != movx || cury != movy) {
                            crossings = geom.Shape.rectCrossingsForLine(crossings, rxmin, rymin, rxmax, rymax, curx, cury, movx, movy);
                        }
                        movx = curx = coords[ci++];
                        movy = cury = coords[ci++];
                        break;
                    case geom.SegmentType.LINE_TO:
                        crossings = geom.Shape.rectCrossingsForLine(crossings, rxmin, rymin, rxmax, rymax, endx = coords[ci++], endy = coords[ci++]);
                        curx = endx;
                        cury = endy;
                        break;
                    case geom.SegmentType.QUAD_TO:
                        crossings = geom.Shape.rectCrossingsForQuad(crossings, rxmin, rymin, rxmax, rymax, curx, cury, coords[ci++], coords[ci++], endx = coords[ci++], endy = coords[ci++], 0);
                        curx = endx;
                        cury = endy;
                        break;
                    case geom.SegmentType.CURVE_TO:
                        crossings = geom.Shape.rectCrossingsForCubic(crossings, rxmin, rymin, rxmax, rymax, curx, cury, coords[ci++], coords[ci++], coords[ci++], coords[ci++], endx = coords[ci++], endy = coords[ci++], 0);
                        curx = endx;
                        cury = endy;
                        break;
                    case geom.SegmentType.CLOSE:
                        if (curx != movx || cury != movy) {
                            crossings = geom.Shape.rectCrossingsForLine(crossings, rxmin, rymin, rxmax, rymax, curx, cury, movx, movy);
                        }
                        curx = movx;
                        cury = movy;
                        break;
                }
            }
            if (crossings != geom.Shape.RECT_INTERSECTS && (curx != movx || cury != movy)) {
                crossings = geom.Shape.rectCrossingsForLine(crossings, rxmin, rymin, rxmax, rymax, curx, cury, movx, movy);
            }
            return crossings;
        }

        append(pi : geom.PathIterator | geom.Shape, connect : boolean) : void {
            if (pi instanceof geom.Shape) {
                pi = pi.getPathIterator(null);
            }
            let coords: number[] = [];
            while (!pi.isDone()) {
                switch (pi.currentSegment(coords)) {
                    case geom.SegmentType.MOVE_TO:
                        if (!connect || this.numTypes < 1 || this.numCoords < 1) {
                            moveTo(coords[0], coords[1]);
                            break;
                        }
                        if (this.pointTypes[this.numTypes - 1] != geom.SegmentType.CLOSE &&
                            this.floatCoords[this.numCoords - 2] == coords[0] &&
                            this.floatCoords[this.numCoords - 1] == coords[1]) {
                            break;
                        }
                    case geom.SegmentType.LINE_TO:
                        this.lineTo(coords[0], coords[1]);
                        break;
                    case geom.SegmentType.QUAD_TO:
                        this.quadTo(coords[0], coords[1], coords[2], coords[3]);
                        break;
                    case geom.SegmentType.CURVE_TO:
                        this.curveTo(coords[0], coords[1], coords[2], coords[3], coords[4], coords[5]);
                        break;
                    case geom.SegmentType.CLOSE:
                        this.closePath();
                        break;
                }
                pi.next();
                connect = false;
            }
        }

        transform(tx : geom.transform.BaseTransform) : void {
            if (this.numCoords == 0) return;
            this.needRoom(false, 6);
            this.floatCoords[this.numCoords + 0] = this.moveX;
            this.floatCoords[this.numCoords + 1] = this.moveY;
            this.floatCoords[this.numCoords + 2] = this.prevX;
            this.floatCoords[this.numCoords + 3] = this.prevY;
            this.floatCoords[this.numCoords + 4] = this.currX;
            this.floatCoords[this.numCoords + 5] = this.currY;
            tx.transform(this.floatCoords, 0, this.floatCoords, 0, this.numCoords / 2 + 3);
            this.moveX = this.floatCoords[this.numCoords + 0];
            this.moveY = this.floatCoords[this.numCoords + 1];
            this.prevX = this.floatCoords[this.numCoords + 2];
            this.prevY = this.floatCoords[this.numCoords + 3];
            this.currX = this.floatCoords[this.numCoords + 4];
            this.currY = this.floatCoords[this.numCoords + 5];
        }

        getBounds() : geom.RectBounds{
            let x1, y1, x2, y2 : number;
            let i : number = this.numCoords;
            if (i > 0) {
                y1 = y2 = this.floatCoords[--i];
                x1 = x2 = this.floatCoords[--i];
                while (i > 0) {
                    let y : number = this.floatCoords[--i];
                    let x : number = this.floatCoords[--i];
                    if (x < x1) x1 = x;
                    if (y < y1) y1 = y;
                    if (x > x2) x2 = x;
                    if (y > y2) y2 = y;
                }
            } else {
                x1 = y1 = x2 = y2 = 0.0;
            }
            return new RectBounds(x1, y1, x2, y2);
        }

        getNumCommands() : number {
            return this.numTypes;
        }
        getCommandsNoClone() : number[] {
            return this.pointTypes;
        }
        getFloatCoordsNoClone() : number[] {
            return this.floatCoords;
        }

        pathDone(): void {
            if (this.numTypes == 0 || this.pointTypes[this.numTypes - 1] != geom.SegmentType.CLOSE) {
                this.needRoom(true, 0);
                this.pointTypes[this.numTypes++] = geom.SegmentType.CLOSE;
                this.prevX = this.currX = this.moveX;
                this.prevY = this.currY = this.moveY;
            }
        }

        getWindingRule() : number{
            return this.windingRule;
        }
        setWindingRule(rule : number) : void {
            if (rule != Path2D.WIND_EVEN_ODD && rule != Path2D.WIND_NON_ZERO) {
                throw new SyntaxError("winding rule must be WIND_EVEN_ODD or WIND_NON_ZERO");
            }
            this.windingRule = rule;
        }

        getCurrentPoint() : geom.Point2D {
            if (this.numTypes < 1) {
                return null;
            }
            return new geom.Point2D(this.currX, this.currY);
        }

        getCurrentX() : number{
            if (this.numTypes < 1) {
                throw new SyntaxError("no current point in empty path");
            }
            return this.currX;
        }

        getCurrentY() : number{
            if (this.numTypes < 1) {
                throw new SyntaxError("no current point in empty path");
            }
            return this.currY;
        }

        reset() : void{
            this.numTypes = this.numCoords = 0;
            this.moveX = this.moveY = this.prevX = this.prevY = this.currX = this.currY = 0;
        }

        createTransformedShape(tx : geom.transform.BaseTransform) : geom.Shape{
            return new geom.Path2D(this, tx);
        }

        copy() : geom.Path2D {
            return new Path2D(this);
        }

        static contains(pi : PathIterator, x? : number, y? : number, p? : geom.Point2D) : boolean {
            if (p !== undefined && p instanceof geom.Point2D) {
                x = p.x;
                y = p.y;
            }

            if (x * 0 + y * 0 == 0) {
                let mask: number  = (pi.getWindingRule() == Path2D.WIND_NON_ZERO ? -1 : 1);
                let cross: number = geom.Shape.pointCrossingsForPath(pi, x, y);
                return ((cross & mask) != 0);
            } else {
                return false;
            }
        }
        static contains(pi : geom.PathIterator, x : number, y : number, w : number, h : number) : boolean {
            if (Number.isNaN(x + w) || Number.isNaN(y + h)) {
                return false;
            }
            if (w <= 0 || h <= 0) {
                return false;
            }
            let mask      : number = (pi.getWindingRule() == Path2D.WIND_NON_ZERO ? -1 : 2);
            let crossings : number = geom.Shape.rectCrossingsForPath(pi, x, y, x + w, y + h);
            return (crossings != geom.Shape.RECT_INTERSECTS && (crossings & mask) != 0);
        }

        contains(x? : number, y? : number, p? : geom.Point2D) : boolean {
            if (p !== undefined && p instanceof geom.Point2D) {
                x = p.x;
                y = p.y;
            }
            if (x * 0 + y * 0 == 0) {
                if (this.numTypes < 2) {
                    return false;
                }
                let mask : number = (this.windingRule == Path2D.WIND_NON_ZERO ? -1 : 1);
                return ((this.pointCrossings(x, y) & mask) != 0);
            } else {
                return false;
            }
        }

        contains(x : number, y : number, w : number, h : number) : boolean {
            if (Number.isNaN(x + w) || Number.isNaN(y + h)) {
                return false;
            }
            if (w <= 0 || h <= 0) {
                return false;
            }
            let mask      : number = (this.windingRule == Path2D.WIND_NON_ZERO ? -1 : 2);
            let crossings : number = this.rectCrossings(x, y, x + w, y + h);
            return (crossings != geom.Shape.RECT_INTERSECTS && (crossings & mask) != 0);
        }

        static intersects(pi : geom.PathIterator, x : number, y : number, w : number, h : number) : boolean {
            if (Number.isNaN(x + w) || Number.isNaN(y + h)) {
                return false;
            }
            if (w <= 0 || h <= 0) {
                return false;
            }
            let mask      : number = (pi.getWindingRule() == Path2D.WIND_NON_ZERO ? -1 : 2);
            let crossings : number = geom.Shape.rectCrossingsForPath(pi, x, y, x + w, y + h);
            return (crossings == geom.Shape.RECT_INTERSECTS || (crossings & mask) != 0);
        }

        intersects(x : number, y : number, w : number, h : number) : boolean {
            if (Number.isNaN(x + w) || Number.isNaN(y + h)) {
                return false;
            }
            if (w <= 0 || h <= 0) {
                return false;
            }
            let mask      : number = (this.windingRule == Path2D.WIND_NON_ZERO ? -1 : 2);
            let crossings : number = this.rectCrossings(x, y, x + w, y + h);
            return (crossings == geom.Shape.RECT_INTERSECTS || (crossings & mask) != 0);
        }

        getPathIterator(tx : geom.transform.BaseTransform, flatness? : number) : PathIterator {
            if (flatness !== undefined) {
                return new FlatteningPathIterator(this.getPathIterator(tx), flatness);
            } else {
                if (tx == null) {
                    return new CopyIterator(this);
                } else {
                    return new TxIterator(this, tx);
                }
            }
        }

        static copyOf(original : number[], newLength : number) : number[] {
            let copy : number[] = [];
            copy = original.slice(0);
            return copy;
        }

        setTo(otherPath : geom.Path2D) : void {
            this.numTypes  = otherPath.numTypes;
            this.numCoords = otherPath.numCoords;
            if (this.numTypes > this.pointTypes.length) {
                this.pointTypes = [];
            }
            this.pointTypes = otherPath.pointTypes.slice(0);
            if (this.numCoords > this.floatCoords.length) {
                this.floatCoords = [];
            }
            this.floatCoords = otherPath.floatCoords.slice(0);
            this.windingRule = otherPath.windingRule;
            this.moveX = otherPath.moveX;
            this.moveY = otherPath.moveY;
            this.prevX = otherPath.prevX;
            this.prevY = otherPath.prevY;
            this.currX = otherPath.currX;
            this.currY = otherPath.currY;
        }

        getNgNode(): scene.NGNode {
            return undefined;
        }
    }
}