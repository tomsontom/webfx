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
}