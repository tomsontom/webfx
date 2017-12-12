namespace scene.shape {
    export enum StrokeType {
        INSIDE, OUTSIDE, CENTERED
    }
    export enum StrokeLineJoin {
        MITER, BEVEL, ROUND
    }
    export enum StrokeLineCap {
        SQUARE, BUTT, ROUND
    }
    export enum ComputeMode {
        STROKE_FILL, FILL, STROKE, EMPTY
    }

    export class StrokeAttributes {
        type       : StrokeType     = Shape.DEFAULT_STROKE_TYPE;
        width      : number         = Shape.DEFAULT_STROKE_LINE_WIDTH;
        lineJoin   : StrokeLineJoin = Shape.DEFAULT_STROKE_LINE_JOIN;
        lineCap    : StrokeLineCap  = Shape.DEFAULT_STROKE_LINE_CAP;
        miterLimit : number         = Shape.DEFAULT_STROKE_MITER_LIMIT;
        dashOffset : number         = Shape.DEFAULT_STROKE_DASH_OFFSET;
        dashArray  : number[]       = Shape.DEFAULT_STROKE_DASH_ARRAY;
    }

    export interface NGShape extends NGNode {
        
    }
    export abstract class Shape extends Node {
        static readonly DEFAULT_STROKE_TYPE        : StrokeType     = StrokeType.CENTERED;
        static readonly DEFAULT_STROKE_LINE_JOIN   : StrokeLineJoin = StrokeLineJoin.MITER;
        static readonly DEFAULT_STROKE_LINE_CAP    : StrokeLineCap  = StrokeLineCap.BUTT;
        static readonly DEFAULT_STROKE_LINE_WIDTH  : number         = 1;
        static readonly DEFAULT_STROKE_MITER_LIMIT : number         = 1;
        static readonly DEFAULT_STROKE_DASH_OFFSET : number         = 1;
        static readonly DEFAULT_STROKE_DASH_ARRAY  : number[]       = [];

        strokeType       : StrokeType;
        strokeWidth      : number;
        strokeLineJoin   : StrokeLineJoin;
        strokeLineCap    : StrokeLineCap;
        strokeMiterLimit : number;
        strokeDashOffset : number;
        strokeDashArray  : number[];
        fill             : scene.paint.Paint;
        stroke           : scene.paint.Paint;


        constructor() {
            super();
            this.strokeType       = Shape.DEFAULT_STROKE_TYPE;
            this.strokeWidth      = 1.0;
            this.strokeLineJoin   = Shape.DEFAULT_STROKE_LINE_JOIN;
            this.strokeLineCap    = Shape.DEFAULT_STROKE_LINE_CAP;
            this.strokeMiterLimit = Shape.DEFAULT_STROKE_MITER_LIMIT;
            this.strokeDashOffset = Shape.DEFAULT_STROKE_DASH_OFFSET;
            this.strokeDashArray  = Shape.DEFAULT_STROKE_DASH_ARRAY;
            this.fill             = scene.paint.Color.BLACK;
            this.stroke           = scene.paint.Color.BLACK;
        }




        computeMode() : ComputeMode {
            if (this.fill != null && this.stroke != null) {
                return ComputeMode.STROKE_FILL;
            } else if (this.fill != null) {
                return ComputeMode.FILL;
            } else if (this.stroke != null) {
                return ComputeMode.STROKE;
            } else {
                return ComputeMode.EMPTY;
            }
        }

    }
}