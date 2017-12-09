namespace geom {
    export enum CornerPrefix { CORNER_ONLY, MOVE_THEN_CORNER, LINE_THEN_CORNER }

    export interface PathIterator {
        getWindingRule() : number;

        isDone() : boolean;

        next() : void;

        currentSegment(coords : number[]) : number;
    }

    export class Path2D extends scene.shape.Shape implements PathConsumer2D {

        public static readonly WIND_EVEN_ODD : number = 0;
        public static readonly WIND_NON_ZERO : number = 1;

        public static readonly SEG_MOVETO    : number = 0;
        public static readonly SEG_LINETO    : number = 1;
        public static readonly SEG_QUADTO    : number = 2;
        public static readonly SEG_CUBICTO   : number = 3;
        public static readonly SEG_CLOSE     : number = 4;

        static readonly curvecoords : number[] = [ 2, 2, 4, 6, 0 ];

        pointTypes  : number[];
        numTypes    : number;
        numCoords   : number;
        windingRule : number;

        static readonly INIT_SIZE  : number = 20;
        static readonly EXPAND_MAX : number = 500;

        floatCoords : number[];
        moveX       : number;
        moveY       : number;
        prevX       : number;
        prevY       : number;
        currX       : number;
        currY       : number;


        constructor();
        constructor(rule : number)
        constructor(rule? : number, initialCapacity? : number) {
            super();
            if (rule && rule >= 0 && rule <= 2) {
                setWindingRule(rule);
            } else {
                setWindingRule(Path2D.WIND_NON_ZERO);
            }
            this.pointTypes = [];
            this.floatCoords = [];
        }

        getPoint(coordindex : number) : geometry.Point2D{

        }


        moveTo(x0: number, y0: number): void {
        }

        lineTo(x0: number, y0: number): void {
        }

        quadTo(xc: number, yc: number, x1: number, y1: number): void {
        }

        curveTo(xc0: number, yc0: number, xc1: number, yc1: number, x1: number, y1: number): void {
        }

        closePath(): void {
        }

        pathDone(): void {
        }

        getNgNode(): scene.NGNode {
            return undefined;
        }
    }
}