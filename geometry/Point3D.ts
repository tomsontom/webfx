import {Utils} from "../util/Utils";

export class Point3D {
    public static readonly ZERO : Point3D = new Point3D(0, 0, 0);
    x : number;
    y : number;
    z : number;


    constructor(x : number, y : number, z : number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }


    distance(px : number, py : number, pz : number) : number {
        var a = this.x - px;
        var b = this.y - py;
        var c = this.z - pz;
        return Math.sqrt(a * a + b * b + c * c);
    }

    add(px : number, py : number, pz : number) : Point3D {
        return new Point3D(this.x + px, this.y + py, this.z + pz);
    }

    subtract(px : number, py : number, pz : number) : Point3D {
        return new Point3D(this.x - px, this.y - py, this.z - pz);
    }

    multiply(factor) : Point3D {
        return new Point3D(this.x * factor, this.y * factor, this.z * factor);
    }

    normalize() : Point3D {
        var mag = this.magnitude();
        if (mag == 0.0) {
            return new Point3D(0, 0, 0);
        }
        return new Point3D(this.x / mag, this.y / mag, this.z / mag);
    }

    midpoint(px : number, py : number, pz : number) : Point3D {
        return new Point3D(px + (this.x - px) / 2.0, py + (this.y - py) / 2.0, pz + (this.z - pz) / 2.0);
    }

    angle(px : number, py : number, pz : number) : number {
        var ax    = this.x;
        var ay    = this.y;
        var az    = this.z;
        var delta = (ax * px + ay * py + az * pz) / Math.sqrt((ax * ax + ay * ay + az * az) * (px * px + py * py + pz * pz));

        if (delta > 1.0) {
            return 0.0;
        }
        if (delta < -1.0) {
            return 180.0;
        }

        return Utils.toDegrees(Math.acos(delta));
    }

    magnitude() : number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    dotProduct(px : number, py : number, pz : number) : number {
        return this.x * px + this.y * py + this.z * pz;
    }

    crossProduct(px : number, py : number, pz : number) : Point3D {
        return new Point3D(this.y * pz - this.z * py,
                           this.z * px - this.x * pz,
                           this.x * py - this.y * px);
    }
}