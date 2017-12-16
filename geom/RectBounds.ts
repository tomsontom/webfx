import {BaseBounds, BoundsType} from "./BaseBounds";
import {Point2D} from "./Point2D";
import {Rectangle} from "./Rectangle";

export class RectBounds extends BaseBounds {

    private minX : number;
    private minY : number;
    private maxX : number;
    private maxY : number;

    constructor();
    constructor(minX : number, minY : number, maxX : number, maxY :number);
    constructor(minX? : number, minY? : number, maxX? : number, maxY? : number) {
        super();
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
    }


    copy(): BaseBounds {
        return new RectBounds(this.minX, this.minY, this.maxX, this.maxY);
    }

    is2D(): boolean {
        return true;
    }

    getBoundsType(): BoundsType {
        return BoundsType.RECTANGLE;
    }

    getWidth(): number {
        return this.maxX - this.minX;
    }

    getHeight(): number {
        return this.maxY - this.minY;
    }

    getMinX(): number {
        return this.minX;
    }

    getMinY(): number {
        return this.minY;
    }

    getMaxX(): number {
        return this.maxX;
    }

    getMaxY(): number {
        return this.maxY;
    }

    translate(x: number, y: number): void {
        this.minX += x;
        this.minY += y;
        this.maxX += x;
        this.maxY += y;
    }

    getMin(min: Point2D) {
        if (min == null) {
            min = new Point2D(this.minX, this.minY);
        }
        min.x = this.minX;
        min.y = this.minY;
        return min;
    }

    getMax(max: Point2D) {
        if (max == null) {
            max = new Point2D(this.maxX, this.maxY);
        }
        max.x = this.maxX;
        max.y = this.maxY;
        return max;
    }

    deriveWithUnion(other: BaseBounds): RectBounds {
        if (other.getBoundsType() == BoundsType.RECTANGLE) {
            let rb : RectBounds = new RectBounds(other.getMinX(), other.getMinY(), other.getMaxX(), other.getMaxY());
            unionWith(rb);
        } else if (other.getBoundsType() == BoundsType.BOX) {
            let bb :BoxBounds = new BoxBounds(other);
            bb.unionWith(this);
            return bb;
        } else {
            throw new SyntaxError("Unknown BoundsType");
        }
        return this;
    }

    deriveWithNewBounds(minX: number, minY: number, maxX: number, maxY: number): RectBounds {
        if ((maxX < minX) || (maxY < minY)) return this.makeEmpty();
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;

        return this;
    }

    deriveWithPadding(h: number, v: number, d: number): RectBounds {
        if (d == 0) {
            this.grow(h, v);
            return this;
        }
        let bb  : BoxBounds = new BoxBounds(this.minX, this.minY, 0, this.maxX, this.maxY, 0);
        bb.grow(h, v, d);
        return bb;
    }

    intersectWith(other: Rectangle): void;
    intersectWith(other: BaseBounds): void;
    intersectWith(minX: number, minY: number, maxX: number, maxY: number): void;
    intersectWith(other, minY?: number, maxX?: number, maxY?: number): void {
    }

    setBoundsAndSort(p1: Point2D, p2: Point2D): void;
    setBoundsAndSort(minX, minY, minZ, maxX, maxY, maxZ): void;
    setBoundsAndSort(p1, p2, minZ?, maxX?, maxY?, maxZ?): void {
    }

    add(p: Point2D): void;
    add(x: number, y: number): void;
    add(p, y?: number): void {
    }

    contains(p: Point2D): boolean;
    contains(x: number, y: number): boolean;
    contains(p, y?: number): boolean {
        return undefined;
    }

    intersects(x: number, y: number, width: number, height: number): boolean {
        return undefined;
    }

    isEmpty(): boolean {
        return undefined;
    }

    roundOut(): void {
    }

    flattenInto(bounds: RectBounds): RectBounds {
        return undefined;
    }

    makeEmpty(): BaseBounds {
        return undefined;
    }

    disjoint(x: number, y: number, width: number, height: number): boolean {
        return undefined;
    }

    protected sortMinMax(): void {
    }
}