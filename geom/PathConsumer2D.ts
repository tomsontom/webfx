namespace geom {
    export interface PathConsumer2D {
        moveTo(x0 : number, y0 : number) : void;
        lineTo(x0 : number, y0 : number) : void;
        quadTo(xc : number, yc : number, x1 : number, y1 : number) : void;
        curveTo(xc0 : number, yc0 : number, xc1 : number, yc1 : number, x1 : number, y1 : number) : void;
        closePath() : void;
        pathDone() : void;
    }
}