import {Point2D} from "./Point2D";
import {Point3D} from "./Point3D";

export abstract class Bounds {
    minX   : number;
    minY   : number;
    minZ   : number;
    maxX   : number;
    maxY   : number;
    maxZ   : number;
    width  : number;
    height : number;
    depth  : number;


    protected constructor(minX : number, minY : number, minZ : number, width : number, height : number, depth : number) {
        this.minX   = minX;
        this.minY   = minY;
        this.minZ   = minZ;
        this.width  = width;
        this.height = height;
        this.depth  = depth;
        this.maxX   = minX + width;
        this.maxY   = minY + height;
        this.maxZ   = minZ + depth;
    }


    abstract isEmpty() : boolean;

    abstract containsPoint2D(p : Point2D) : boolean;
    abstract containsPoint3D(p : Point3D) : boolean;
    abstract containsBounds(b : Bounds) : boolean;
    abstract contains(x : number, y : number) : boolean;
    abstract contains(x : number, y : number, z : number) : boolean;
    abstract contains(x : number, y : number, w : number, h : number) : boolean;
    abstract contains(x : number, y :number, z : number, w : number, h : number, d : number) : boolean;

    abstract intersectsBounds(b : Bounds) : boolean;
    abstract intersects(x : number, y : number, w : number, h : number) : boolean;
    abstract intersects(x : number, y : number, z : number, w : number, h : number, d : number) : boolean;

}