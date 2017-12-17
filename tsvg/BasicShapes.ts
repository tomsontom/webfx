import { TNode } from "./Base";
import { Length, LengthUtils } from "./Utils";

export enum FillRule {
    nonzero,evenodd,inherit
}

export enum PointerEvents {
    visiblePainted,
    visibleFill,
    visibleStroke,
    visible,
    painted,
    fill,
    stroke,
    all,
    none,
    inherit
}

export enum ShapeRendering {
    auto,
    optimizeSpeed,
    crispEdges,
    geometricPrecision,
    inherit
}

export enum StrokeLineCap {
    butt,
    round,
    square,
    inherit
}

export enum StrokeLinejoin {
    miter,
    round,
    bevel,
    inherit
}

export type NumberOrInherit = number | "inherit";
export type DashArray = number[] | "none" | "inherit";

export class TShape extends TNode {
    constructor(type : string) {
        super(type);
    }

    get fill() {
        return this.get("fill");
    }

    set fill( fill : string) {
        this.set("fill",fill);
    }

    get fillOpacity() : NumberOrInherit {
        var rv = this.get("fill-opacity");
        if( rv == "inherit" ) {
            return "inherit";
        }
        return Number(rv);
    }

    set fillOpacity(fillOpacity: NumberOrInherit) {
        var value = String(fillOpacity);
        if( typeof fillOpacity === "number" && ( fillOpacity < 0 || fillOpacity > 1 ) ) {
            console.log("Opacity of '",fillOpacity,"' is not in range 0.0 - 1.0");
        }

        this.set("fill-opacity",String(fillOpacity));
    }

    set fillRule(fillRule: FillRule) {
        this.set("fill-rule",String(fillRule));
    }

    get fillRule() {
        var v = this.get("fill-rule");
        if( v == "nonzero" ) {
            return FillRule.nonzero;
        } else if( v == "evenodd" ) {
            return FillRule.evenodd;
        }
        return FillRule.inherit;
    }

    get filter() : string {
        return this.get("filter");
    }

    set filter(filter : string) {
        this.set("filter",filter);
    }

    set opacity(opacity: NumberOrInherit) {
        var value = String(opacity);
        if( typeof opacity === "number" && ( opacity < 0 || opacity > 1 ) ) {
            console.log("Opacity of '",opacity,"' is not in range 0.0 - 1.0");
        }

        this.set("opacity",String(opacity));
    }

    get opacity() : NumberOrInherit {
        var rv = this.get("opacity");
        if( rv == "inherit" ) {
            return "inherit";
        }
        return Number(rv);
    }

    set pointerEvents(pointerEvents: PointerEvents) {
        this.set("pointer-events",String(pointerEvents));
    }

    get pointerEvents() : PointerEvents {
        var value = this.get("pointer-events");
        
        switch(value) {
            case "visiblePainted"   : return PointerEvents.visiblePainted;
            case "visibleFill"      : return PointerEvents.visibleFill;
            case "visibleStroke"    : return PointerEvents.visibleStroke;
            case "visible"          : return PointerEvents.visible;
            case "painted"          : return PointerEvents.painted;
            case "fill"             : return PointerEvents.fill;
            case "stroke"           : return PointerEvents.stroke;
            case "all"              : return PointerEvents.all;
            case "none"             : return PointerEvents.none;
            case "inherit"          : return PointerEvents.inherit;
        }

        return PointerEvents.visiblePainted;
    }

    set shapeRendering(shapeRendering: ShapeRendering) {
        this.set("shape-rendering",String(shapeRendering));
    }

    get shapeRendering() : ShapeRendering {
        var value = this.get("shape-rendering");
        
        switch(value) {
            case "auto"                 : return ShapeRendering.auto;
            case "optimizeSpeed"        : return ShapeRendering.optimizeSpeed;
            case "crispEdges"           : return ShapeRendering.crispEdges;
            case "geometricPrecision"   : return ShapeRendering.geometricPrecision;
            case "inherit"              : return ShapeRendering.inherit;
        }

        return ShapeRendering.auto;
    }

    set stroke(stroke : string) {
        this.set("stroke",stroke);
    }

    get stroke() {
        return this.get("stroke");
    }

    set strokeDasharray(strokeDasharray : DashArray) {
        if( typeof strokeDasharray === "string" ) {
            this.set("stroke-dasharray",String(strokeDasharray));
        } else {
            this.set("stroke-dasharray",strokeDasharray.join(","));
        }
    }

    get strokeDasharray() : DashArray {
        var value = this.get("stroke-dasharray");

        if( value == "none" ) {
            return "none";
        } else if( value == "inherit" ) {
            return "inherit";
        }
        return value.split(",").map( v => Number(v) );
    }

    get strokeDashoffset() : Length {
        var v = this.get("stroke-dashoffset");
        return v ? v : 0;
    }

    set strokeDashoffset(strokeDashoffset: Length) {
        if( LengthUtils.isValid(strokeDashoffset,true) ) {
            this.set("stroke-dashoffset",String(strokeDashoffset));
        } else {
            console.log("Invalid length value '",strokeDashoffset,"'");
        }
    }

    set strokeLinecap(strokeLinecap : StrokeLineCap) {
        this.set("stroke-linecap",String(strokeLinecap));
    }

    get strokeLinecap() {
        var v = this.get("stroke-linecap");
        switch(v) {
            case "butt"     : return StrokeLineCap.butt;
            case "round"    : return StrokeLineCap.round;
            case "square"   : return StrokeLineCap.square;
            case "inherit"  : return StrokeLineCap.inherit;
        }
        return StrokeLineCap.butt;
    }

    set strokeLinejoin( strokeLinejoin: StrokeLinejoin ) {
        this.set("stroke-linejoin",String(strokeLinejoin));
    }

    get strokeLinejoin() : StrokeLinejoin {
        var v = this.get("stroke-linejoin");
        switch(v) {
            case "miter" : return StrokeLinejoin.miter;
            case "round" : return StrokeLinejoin.round;
            case "bevel" : return StrokeLinejoin.bevel;
            case "inherit" : return StrokeLinejoin.inherit;
        }

        return StrokeLinejoin.miter;
    }

    // stroke-miterlimit

    set strokeOpacity(strokeOpacity: NumberOrInherit) {
        this.set("stroke-opacity",String(strokeOpacity));
    }

    get strokeOpacity() {
        var v = this.get("stroke-opacity");
        if( v == "inherit" ) {
            return "inherit";
        }
        return v ? Number(v) : 1;
    }

    set strokeWidth(strokeWidth: Length) {
        if( LengthUtils.isValid(strokeWidth,true) ) {
            this.set("stroke-width",String(strokeWidth));
        } else {
            console.log("Invalid length value '",strokeWidth,"'");
        }
    }

    get strokeWidth() : Length {
        return this.get("stroke-width");
    }
}

export class TSVGRect extends TShape {
    constructor() {
        super("rect");
    }

    get x() : Length {
        return this.get("x");
    }

    set x( x : Length) {
        if( LengthUtils.isValid(x) ) {
            this.set("x",String(x));
        } else {
            console.log("Invalid length value '",x,"'");
        }
    }

    get y() : Length {
        return this.get("y");
    }

    set y( y : Length) {
        if( LengthUtils.isValid(y) ) {
            this.set("y",String(y));
        } else {
            console.log("Invalid length value '",y,"'");
        }
    }

    get width() : Length {
        return this.get("width");
    }

    set width( width : Length) {
        if( LengthUtils.isValid(width) ) {
            this.set("width",String(width));
        } else {
            console.log("Invalid length value '",width,"'");
        }
    }

    get height() : Length {
        return this.get("height");
    }

    set height( height : Length) {
        if( LengthUtils.isValid(height) ) {
            this.set("height",String(height));
        } else {
            console.log("Invalid length value '",height,"'");
        }
    }

    get rx() : Length {
        return this.get("rx");
    }

    set rx( rx : Length) {
        if( LengthUtils.isValid(rx) ) {
            this.set("rx",String(rx));
        } else {
            console.log("Invalid length value '",rx,"'");
        }
    }

    get ry() : Length {
        return this.get("ry");
    }

    set ry( ry : Length) {
        if( LengthUtils.isValid(ry) ) {
            this.set("ry",String(ry));
        } else {
            console.log("Invalid length value '",ry,"'");
        }
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

    // external resources required
    get externalResourcesRequired() : boolean {
        return Boolean(this.get("externalResourcesRequired"));
    }

    set externalResourcesRequired( externalResourcesRequired: boolean ) {
        this.set("externalResourcesRequired",String(externalResourcesRequired));
    }

    // xml-namespaces
    get xmllang() : string {
        return this.get("xmllang");
    }

    set xmllang(xmllang : string) {
        this.set("xmllang",xmllang);
    }

    get xmlspace() {
        return this.get("xmlspace");
    }

    set xmlspace(xmlspace: string) {
        this.set("xmlspace",xmlspace);
    }
}
