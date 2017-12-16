import {Utils} from "../util/Utils";
import {Point3D} from "./Point3D";

export class Point2D {
    public static readonly ZERO : Point2D = new Point2D(0, 0);
    x : number;
    y : number;


    constructor(x : number, y : number) {
        this.x = x;
        this.y = y;
    }


    distance(px : number, py : number) : number {
        px -= this.x;
        py -= this.y;
        return Math.sqrt(px * px + py * py);
    }

    add(px : number, py : number) : Point2D {
        return new Point2D(this.x + px, this.y + py);
    }

    subtract(px : number, py : number) : Point2D {
        return new Point2D(this.x - px, this.y - py);
    }

    multiply(factor : number) : Point2D {
        return new Point2D(this.x * factor, this.y * factor);
    }

    normalize() : Point2D {
        var mag : number = this.magnitude();
        if (mag == 0.0) {
            return new Point2D(0, 0);
        }
        return new Point2D(this.x / mag, this.y / mag);
    }

    midpoint(px : number, py : number) : Point2D {
        return new Point2D(px + (this.x - px) / 2.0, py + (this.y - py) / 2.0);
    }

    angle(px : number, py : number) : number {
        var ax    = this.x;
        var ay    = this.y;
        var delta = (ax * px + ay * py) / Math.sqrt((ax * ax + ay * ay) * (px * px + py * py));

        if (delta > 1.0)  { return 0.0; }
        if (delta < -1.0) { return 180.0; }

        return Utils.toDegrees(Math.acos(delta));
    }

    magnitude() : number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    dotProduct(px : number, py : number) : number {
        return this.x * px + this.y * py;
    }

    crossProduct(px : number, py : number) : Point3D {
        return new Point3D(0, 0, this.x * py - this.y * px);
    }
}