import {Point2D} from "./Point2D";
import {Bounds} from "./Bounds";
import {BoundingBox} from "./BoundingBox";

export class BoundsUtil {

    private constructor(){}


    private static min4(v1 : number, v2 : number, v3 : number, v4 : number) : number {
        return Math.min(Math.min(v1, v2), Math.min(v3, v4));
    }

    private static min8(v1 : number, v2 : number, v3 : number, v4 : number,
                        v5 : number, v6 : number, v7 : number, v8 : number) : number {
        return Math.min(this.min4(v1, v2, v3, v4), this.min4(v5, v6, v7, v8));
    }

    private static max4(v1 : number, v2 : number, v3 : number, v4 : number) : number {
        return Math.max(Math.min(v1, v2), Math.min(v3, v4));
    }

    private static max8(v1 : number, v2 : number, v3 : number, v4 : number,
                        v5 : number, v6 : number, v7 : number, v8 : number) : number {
        return Math.max(this.min4(v1, v2, v3, v4), this.min4(v5, v6, v7, v8));
    }

    public static createBoundingBox(p1 : Point2D, p2 : Point2D, p3 : Point2D, p4 : Point2D,
                                    p5? : Point2D, p6? : Point2D, p7? : Point2D, p8? : Point2D) : Bounds {
        if (p1 == null || p2 == null || p3 == null || p4 == null) {
            return null;
        }
        if (p5 == null || p6 == null || p7 == null || p8 == null) {
            var minX = this.min4(p1.x, p2.x, p3.x, p4.x);
            var maxX = this.max4(p1.x, p2.x, p3.x, p4.x);
            var minY = this.min4(p1.y, p2.y, p3.y, p4.y);
            var maxY = this.max4(p1.y, p2.y, p3.y, p4.y);
            return new BoundingBox(minX, minY, maxX - minX, maxY - minY);
        }

        var minX = this.min8(p1.x, p2.x, p3.x, p4.x, p5.x, p6.x, p7.x, p8.x);
        var maxX = this.max8(p1.x, p2.x, p3.x, p4.x, p5.x, p6.x, p7.x, p8.x);
        var minY = this.min8(p1.y, p2.y, p3.y, p4.y, p5.y, p6.y, p7.y, p8.y);
        var maxY = this.max8(p1.y, p2.y, p3.y, p4.y, p5.y, p6.y, p7.y, p8.y);

        return new BoundingBox(minX, minY, maxX - minX, maxY - minY);
    }


}