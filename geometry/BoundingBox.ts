import {Bounds} from "./Bounds";
import {Point2D} from "./Point2D";
import {Point3D} from "./Point3D";

export class BoundingBox extends Bounds {

    constructor(minX : number, minY : number, width : number, height : number) {
        super(minX, minY, 0, width, height, 0);
    }


    isEmpty(): boolean {
        return this.maxX < this.minX || this.maxY < this.minY || this.maxZ < this.minZ;
    }

    containsPoint2D(p: Point2D): boolean {
        return this.contains(p.x, p.y);
    }
    containsPoint3D(p: Point3D): boolean {
        return this.contains(p.x, p.y, p.z);
    }
    containsBounds(b: Bounds): boolean {
        return this.contains(b.minX, b.minY, b.width, b.height);
    }
    contains(x: number, y: number, z?: number, w?: number, h?: number, d?: number): boolean {
        if (z == null && w == null && h == null && d == null) {
            return x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY;
        } else if (w == null && h == null && d == null) {
            return x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY && z >= this.minZ && z <= this.maxZ;
        } else if (h == null && d == null) {
            return x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY && x + z >= this.minX && x + z <= this.maxX && y + w >= this.minY && y + w <= this.maxY;
        } else {
            return x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY && z >= this.minZ && z <= this.maxZ &&
                   x + w >= this.minX && x + w <= this.maxX && y + h >= this.minY && y + h <= this.maxY && z + d >= this.minZ && z + d <= this.maxZ;
        }
    }

    intersectsBounds(b: Bounds): boolean {
        return this.intersects(b.minX, b.minY, 0, b.width, b.height, 0);
    }
    intersects(x: number, y: number, z: number, w: number, h?: number, d?: number): boolean {
        if (this.isEmpty() || w < 0 || h < 0 || d < 0) return false;
        return (x + w >= this.minX &&
                y + h >= this.minY &&
                z + d >= this.minZ &&
                x <= this.maxX &&
                y <= this.maxY &&
                z <= this.maxZ);
    }
}