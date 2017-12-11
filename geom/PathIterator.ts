namespace geom {
    export enum SegmentType {
        MOVE_TO, LINE_TO, QUAD_TO, CURVE_TO, CLOSE
    }
    export enum WindingRule {
        WIND_EVEN_ODD, WIND_NON_ZERO
    }
    export interface PathIterator {

        getWindingRule() : WindingRule;

        isDone() : boolean;

        next() : void;

        currentSegment(coords : number[]) : number;
    }
}