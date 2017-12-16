import {Point2D} from "./Point2D";

export class Rectangle2D {
    public static readonly EMPTY : Rectangle2D = new Rectangle2D(0, 0, 0, 0);
    minX   : number;
    minY   : number;
    maxX   : number;
    maxY   : number;
    width  : number;
    height : number;


    constructor(minX : number, minY : number, width : number, height : number) {
        this.minX   = minX;
        this.minY   = minY;
        this.width  = width;
        this.height = height;
        this.maxX   = minX + width;
        this.maxY   = minY + height;
    }


    containsPoint(point : Point2D) : boolean {
        return this.contains(point.x, point.y);
    }
    containsRect(rect : Rectangle2D) : boolean {
        return this.contains(rect.minX, rect.minY, rect.width, rect.height);
    }
    contains(x : number, y : number, w? : number, h? : number) : boolean {
        if (w == null || h == null) {
            return x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY;
        } else {
            return x >= this.minX && y >= this.minY && w <= this.maxX - x && h <= this.maxY - y;
        }
    }

    intersectsRect(rect : Rectangle2D) : boolean {
        return this.intersects(rect.minX, rect.minY, rect.width, rect.height);
    }
    intersects(x : number, y : number, w : number, h : number) : boolean {
        return x < this.maxX && y < this.maxY && x + w > this.minX && y + h > this.minY;
    }
}