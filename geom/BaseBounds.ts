import Point2D = geom.Point2D;
import Rectangle = geom.Rectangle;
import RectBounds = geom.RectBounds;

export enum BoundsType {
    RECTANGLE, BOX
}

export abstract class BaseBounds {

    constructor() { }


    abstract copy() : BaseBounds;

    abstract is2D() : boolean;

    abstract getBoundsType() : BoundsType;

    abstract getWidth() : number;

    abstract getHeight() : number;

    abstract getMinX() : number;

    abstract getMinY() : number;

    abstract getMaxX() : number;

    abstract getMaxY() : number;

    abstract translate(x : number, y: number) : void;

    abstract getMin(min : Point2D);

    abstract getMax(max : Point2D);

    abstract deriveWithUnion(other : BaseBounds) : BaseBounds;

    abstract deriveWithNewBounds(other : Rectangle) : BaseBounds;
    abstract deriveWithNewBounds(other : BaseBounds) : BaseBounds;

    abstract deriveWithNewBounds(minX : number, minY : number, maxX : number, maxY : number) : BaseBounds;

    abstract deriveWithPadding(h : number, v : number, d : number) : BaseBounds;

    abstract intersectWith(other : Rectangle) : void;
    abstract intersectWith(other : BaseBounds) : void;

    abstract intersectWith(minX : number, minY : number, maxX : number, maxY : number) : void;

    abstract setBoundsAndSort(p1 : Point2D, p2 : geom.Point2D) : void;
    abstract setBoundsAndSort(minX, minY,  minZ, maxX, maxY, maxZ) : void;

    abstract add(p : Point2D) : void;
    abstract add(x : number, y : number) : void;

    abstract contains(p : Point2D) : boolean;

    abstract contains(x : number, y : number) : boolean;

    abstract intersects(x : number, y : number, width : number, height : number) : boolean;

    abstract isEmpty() : boolean;

    abstract roundOut() : void;

    abstract flattenInto(bounds : RectBounds) : RectBounds;

    abstract makeEmpty() : BaseBounds;

    abstract disjoint(x : number, y : number, width : number, height : number) : boolean;

    protected abstract sortMinMax() : void;

    static getInstance(minX : number, minY : number, maxX : number, maxY : number) : BaseBounds{
        return new RectBounds(minX, minY, maxX, maxY);
    }
}