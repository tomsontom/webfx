namespace geom {
    export enum BoundsType {
        RECTANGLE, BOX
    }
    
    export abstract class BaseBounds {
        
        constructor() { }


        abstract copy() : geom.BaseBounds;

        abstract is2D() : boolean;

        abstract getBoundsType() : geom.BoundsType;
        
        abstract getWidth() : number;
        
        abstract getHeight() : number;

        abstract getMinX() : number;

        abstract getMinY() : number;

        abstract getMaxX() : number;

        abstract getMaxY() : number;

        abstract translate(x : number, y: number) : void;

        abstract getMin(min : geom.Point2D);

        abstract getMax(max : geom.Point2D);
        
        abstract deriveWithUnion(other : BaseBounds) : geom.BaseBounds;
        
        abstract deriveWithNewBounds(other : Rectangle) : geom.BaseBounds;
        abstract deriveWithNewBounds(other : BaseBounds) : geom.BaseBounds;

        abstract deriveWithNewBounds(minX : number, minY : number, maxX : number, maxY : number) : geom.BaseBounds;

        abstract deriveWithPadding(h : number, v : number, d : number) : geom.BaseBounds;

        abstract intersectWith(other : geom.Rectangle) : void;
        abstract intersectWith(other : geom.BaseBounds) : void;

        abstract intersectWith(minX : number, minY : number, maxX : number, maxY : number) : void;
        
        abstract setBoundsAndSort(p1 : geom.Point2D, p2 : geom.Point2D) : void;
        abstract setBoundsAndSort(minX, minY,  minZ, maxX, maxY, maxZ) : void;
        
        abstract add(p : geom.Point2D) : void;
        abstract add(x : number, y : number) : void;

        abstract contains(p : geom.Point2D) : boolean;

        abstract contains(x : number, y : number) : boolean;

        abstract intersects(x : number, y : number, width : number, height : number) : boolean;

        abstract isEmpty() : boolean;

        abstract roundOut() : void;
        
        abstract flattenInto(bounds : geom.RectBounds) : geom.RectBounds;

        abstract makeEmpty() : geom.BaseBounds;

        abstract disjoint(x : number, y : number, width : number, height : number) : boolean;

        protected abstract sortMinMax() : void;

        static getInstance(minX : number, minY : number, maxX : number, maxY : number) : geom.BaseBounds{
            return new geom.RectBounds(minX, minY, maxX, maxY);
        }
    }
}