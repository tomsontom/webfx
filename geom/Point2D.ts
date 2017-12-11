namespace geom {
    export class Point2D {
        x : number;
        y : number;


        constructor(x : number, y : number) {
            this.x = x;
            this.y = y;
        }


        setLocation(x : number, y : number) : void {
            this.x = x;
            this.y = y;
        }

        set(x : number, y : number) : void {
            this.x = x;
            this.y = y;
        }

        static distanceSq(x1 : number, y1 : number, x2 : number, y2 : number) : number {
            x1 -= x2;
            y1 -= y2;
            return (x1 * x1 + y1 * y1);
        }

        static distance(x1 : number, y1 : number, x2 : number , y2 : number) : number {
            x1 -= x2;
            y1 -= y2;
            return Math.sqrt(x1 * x1 + y1 * y1);
        }

        distanceSq(px : number, py : number) : number {
            px -= this.x;
            py -= this.y;
            return (px * px + py * py);
        }

        distance(px : number, py : number) : number {
            px -= this.x;
            py -= this.y;
            return Math.sqrt(px * px + py * py);
        }

        add(x : number, y : number) : geom.Point2D {
            return new geom.Point2D(this.x + x, this.y + y);
        }

        subtract(x : number, y : number) : geom.Point2D {
            return new Point2D(this.x - x, this.y - y);
        }

        multiply(factor : number) : geom.Point2D {
            return new Point2D(this.x * factor, this.y * factor);
        }

        normalize() : geom.Point2D {
            let mag : number = this.magnitude();

            if (mag == 0.0) {
                return new Point2D(0.0, 0.0);
            }

            return new Point2D(this.x / mag, this.y / mag);
        }

        midpoint(x : number, y : number) : geom.Point2D{
            return new Point2D(x + (this.x - x) / 2.0, y + (this.y - y) / 2.0);
        }

        angle(x : number, y : number) : number {
            let ax : number = this.x;
            let ay : number = this.y;

            let delta : number = (ax * x + ay * y) / Math.sqrt((ax * ax + ay * ay) * (x * x + y * y));

            if (delta > 1.0) {
                return 0.0;
            }
            if (delta < -1.0) {
                return 180.0;
            }

            return util.Utils.toDegrees(Math.acos(delta));
        }

        angle1(x1 : number, y1 : number, x2 : number, y2 : number) : number {
            let x : number = this.x;
            let y : number = this.y;

            let ax : number = x1 - x;
            let ay : number = y1 - y;
            let bx : number = x2 - x;
            let by : number = y2 - y;

            let delta : number = (ax * bx + ay * by) / Math.sqrt((ax * ax + ay * ay) * (bx * bx + by * by));

            if (delta > 1.0) {
                return 0.0;
            }
            if (delta < -1.0) {
                return 180.0;
            }

            return util.Utils.toDegrees(Math.acos(delta));
        }

        magnitude() : number{
            let x : number = this.x;
            let y : number = this.y;

            return Math.sqrt(x * x + y * y);
        }

        dotProduct(x : number, y : number) : number{
            return this.x * x + this.y * y;
        }
    }
}