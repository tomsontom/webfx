import { TNode, TGElement } from "./SVG";

export class TRoundedRect extends TNode {
    private _x      : number = 0;
    private _y      : number = 0;
    private _width  : number = 0;
    private _height : number = 0;

    private _topLeftHorizontalRadius     : number = 0;
    private _topLeftVerticalRadius       : number = 0;
    private _topRightVerticalRadius      : number = 0;
    private _topRightHorizontalRadius    : number = 0;
    private _bottomRightHorizontalRadius : number = 0;
    private _bottomRightVerticalRadius   : number = 0;
    private _bottomLeftVerticalRadius    : number = 0;
    private _bottomLeftHorizontalRadius  : number = 0;

    constructor() {
        super("path");
        this.set("stroke","red");
        this.set("fill","transparent");
        this.set("stroke-width","5");
    }

    get x() : number {
        return this._x;
    }

    set x( x : number) {
        this._x = x;
    }

    get y() : number {
        return this._y;
    }

    set y( y : number) {
        this._y = y;
    }

    get width() : number {
        return this._width;
    }

    set width( width : number) {
        this._width = width;
    }

    get height() : number {
        return this._height;
    }

    set height( height : number) {
        this._height = height;
    }

    get fill() {
        return this.get("fill");
    }

    set fill( fill : string) {
        this.set("fill",fill);
    }

    // styleable
    get class() : string {
        return this.get("class");
    }

    set class( cl : string) {
        this.set("class",cl);
    }

    // transformable
    get transform() : string {
        return this.get("transform");
    }

    set transform(transform : string) {
        this.set("transform",transform);
    }
    
    set topLeftHorizontalRadius( topLeftHorizontalRadius: number) {
        this._topLeftHorizontalRadius = topLeftHorizontalRadius;
    }

    get topLeftHorizontalRadius() {
        return this._topLeftHorizontalRadius;
    }

    set topRightHorizontalRadius( topRightHorizontalRadius : number) {
        this._topRightHorizontalRadius = topRightHorizontalRadius;
    }

    get topRightHorizontalRadius() {
        return this._topRightHorizontalRadius;
    }

    set topRightVerticalRadius( topRightVerticalRadius: number) {
        this._topRightVerticalRadius = topRightVerticalRadius;
    }

    get topRightVerticalRadius() {
        return this._topRightVerticalRadius;
    }

    set bottomRightVerticalRadius(bottomRightVerticalRadius: number) {
        this._bottomRightVerticalRadius = bottomRightVerticalRadius;
    }

    get bottomRightVerticalRadius() {
        return this._bottomRightVerticalRadius;
    }

    set bottomRightHorizontalRadius(bottomRightHorizontalRadius : number) {
        this._bottomRightHorizontalRadius = bottomRightHorizontalRadius;
    }

    get bottomRightHorizontalRadius() {
        return this._bottomRightHorizontalRadius;
    }

    get bottomLeftVerticalRadius() {
        return this._bottomLeftVerticalRadius;
    }

    set bottomLeftVerticalRadius(bottomLeftVerticalRadius : number) {
        this._bottomLeftVerticalRadius = bottomLeftVerticalRadius;
    }

    get bottomLeftHorizontalRadius() {
        return this._bottomLeftHorizontalRadius;
    }

    set bottomLeftHorizontalRadius(bottomLeftHorizontalRadius: number) {
        this._bottomLeftHorizontalRadius = bottomLeftHorizontalRadius;
    }

    get topLeftVerticalRadius() {
        return this._topLeftVerticalRadius;
    }

    set topLeftVerticalRadius(topLeftVerticalRadius: number) {
        this._topLeftVerticalRadius = topLeftVerticalRadius;
    }

    pack() {
        this.set("d",this.buildPath());
    }

    private buildPath() : string {
        var pathBuilder = new TSVGPathBuilder();
        pathBuilder = pathBuilder.moveTo(this._x, this._y, true);

        if( this._topLeftHorizontalRadius ) {
            pathBuilder = pathBuilder.moveTo(this._topLeftHorizontalRadius,0);
        }

        var w = this._width - this._topLeftHorizontalRadius - this._topRightHorizontalRadius;
        pathBuilder = pathBuilder.hLineTo(w);
        
        if( this._topRightHorizontalRadius || this._topRightVerticalRadius ) {
            pathBuilder = pathBuilder.arcTo(
                this._topRightHorizontalRadius, this._topRightVerticalRadius,
                0,false,true,
                this._topRightHorizontalRadius, this._topRightVerticalRadius
            );
        }

        var h = this._height - this._topRightVerticalRadius - this._bottomRightVerticalRadius;
        pathBuilder = pathBuilder.vLineTo(h);

        if( this._bottomRightHorizontalRadius || this._bottomRightVerticalRadius ) {
            pathBuilder = pathBuilder.arcTo(
                this._bottomRightHorizontalRadius, this._bottomRightVerticalRadius,
                0,false,true,
                -this._bottomRightHorizontalRadius, this._bottomRightVerticalRadius);
        }

        w = this._width - this._bottomLeftHorizontalRadius - this._bottomRightVerticalRadius;

        pathBuilder = pathBuilder.hLineTo(-w);

        if( this._bottomLeftHorizontalRadius || this._bottomLeftVerticalRadius ) {
            pathBuilder = pathBuilder.arcTo(
                this._bottomLeftHorizontalRadius, this._bottomLeftVerticalRadius,
                0,false,true,
                -this._bottomLeftHorizontalRadius, -this._bottomLeftVerticalRadius
            );
        }

        h = this._height - this._bottomLeftVerticalRadius - this._topLeftVerticalRadius;
        pathBuilder = pathBuilder.vLineTo(-h);

        if( this._topLeftHorizontalRadius || this._topLeftVerticalRadius ) {
            pathBuilder = pathBuilder.arcTo(
                this._topLeftHorizontalRadius, this._topLeftVerticalRadius,
                0,false,true,
                this._topLeftHorizontalRadius, -this._topLeftVerticalRadius
            );
        }

        pathBuilder = pathBuilder.close();

        return pathBuilder.path();
    }
}

export class TSVGPathBuilder {
    private d : string = "";

    moveTo( x : number, y : number, absolute? : boolean) : TSVGPathBuilder {
        this.d += (absolute ? "M" : "m") + x + " " + y + " ";
        return this;
    }

    lineTo( x : number, y : number, absolute? : boolean ) : TSVGPathBuilder {
        this.d += (absolute ? "L" : "l") + x + " " + y + " ";
        return this;
    }

    hLineTo( x : number, absolute? : boolean ) : TSVGPathBuilder {
        this.d += (absolute ? "H" : "h") + x + " ";
        return this;
    }

    vLineTo(y : number, absolute? : boolean ) : TSVGPathBuilder {
        this.d += (absolute ? "V" : "v") + y + " ";
        return this;
    }

    arcTo( rx : number, ry : number, xAxisRotation: number, largeArcFlag : boolean,  sweepFlag : boolean, x : number, y : number, absolute?: boolean ) : TSVGPathBuilder {
        this.d += ( absolute ? "A" : "a" ) + rx + "," + ry + " ";
        this.d += xAxisRotation + " ";
        this.d += (largeArcFlag ? "1" : "0" ) + "," + (sweepFlag ? "1" : "0") + " ";
        this.d += x + "," + y + " ";
        return this;
    }

    curveTo(x1: number, y1: number, x2: number, y2: number, x: number, y: number, absolute?: boolean ) : TSVGPathBuilder {
        this.d += ( absolute ? "C" : "c" ) + x1 + "," + y1 + " ";
        this.d += x2 + "," + y2 + " ";
        this.d += x + "," + y + " ";
        return this;
    }

    smoothCurveTo(x2: number, y2: number, x: number, y: number, absolute?: boolean ) : TSVGPathBuilder {
        this.d += ( absolute ? "S" : "s" ) + x2 + "," + y2 + " ";
        this.d += x + "," + y  + " ";
        return this;
    }

    quadraticCurveTo(x1: number, y1: number, x: number, y: number, absolute?: boolean ) : TSVGPathBuilder {
        this.d += ( absolute ? "Q" : "q" ) + x1 + "," + y1 + " ";
        this.d += x + "," + y + " ";
        return this;
    }

    smoothQuadraticCurveTo(x1: number, y1: number, x: number, y: number, absolute?: boolean ) : TSVGPathBuilder {
        this.d += ( absolute ? "T" : "t" ) + x + "," + y + " ";
        return this;
    }

    close() : TSVGPathBuilder {
        this.d += "Z";
        return this;
    }

    path() : string {
        return this.d;
    }
}