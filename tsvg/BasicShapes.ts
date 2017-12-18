import { TNode } from "./Base";
import { TLength, TLengthUtils } from "./Utils";

export enum TFillRule {
    nonzero,evenodd,inherit
}

export enum TPointerEvents {
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

export enum TShapeRendering {
    auto,
    optimizeSpeed,
    crispEdges,
    geometricPrecision,
    inherit
}

export enum TStrokeLineCap {
    butt,
    round,
    square,
    inherit
}

export enum TStrokeLinejoin {
    miter,
    round,
    bevel,
    inherit
}

export type TNumberOrInherit = number | "inherit";
export type TDashArray = number[] | "none" | "inherit";

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

    get fillOpacity() : TNumberOrInherit {
        var rv = this.get("fill-opacity");
        if( rv == "inherit" ) {
            return "inherit";
        }
        return Number(rv);
    }

    set fillOpacity(fillOpacity: TNumberOrInherit) {
        var value = String(fillOpacity);
        if( typeof fillOpacity === "number" && ( fillOpacity < 0 || fillOpacity > 1 ) ) {
            console.log("Opacity of '",fillOpacity,"' is not in range 0.0 - 1.0");
        }

        this.set("fill-opacity",String(fillOpacity));
    }

    set fillRule(fillRule: TFillRule) {
        this.set("fill-rule",String(fillRule));
    }

    get fillRule() {
        var v = this.get("fill-rule");
        if( v == "nonzero" ) {
            return TFillRule.nonzero;
        } else if( v == "evenodd" ) {
            return TFillRule.evenodd;
        }
        return TFillRule.inherit;
    }

    get filter() : string {
        return this.get("filter");
    }

    set filter(filter : string) {
        this.set("filter",filter);
    }

    set opacity(opacity: TNumberOrInherit) {
        var value = String(opacity);
        if( typeof opacity === "number" && ( opacity < 0 || opacity > 1 ) ) {
            console.log("Opacity of '",opacity,"' is not in range 0.0 - 1.0");
        }

        this.set("opacity",String(opacity));
    }

    get opacity() : TNumberOrInherit {
        var rv = this.get("opacity");
        if( rv == "inherit" ) {
            return "inherit";
        }
        return Number(rv);
    }

    set pointerEvents(pointerEvents: TPointerEvents) {
        this.set("pointer-events",String(pointerEvents));
    }

    get pointerEvents() : TPointerEvents {
        var value = this.get("pointer-events");
        
        switch(value) {
            case "visiblePainted"   : return TPointerEvents.visiblePainted;
            case "visibleFill"      : return TPointerEvents.visibleFill;
            case "visibleStroke"    : return TPointerEvents.visibleStroke;
            case "visible"          : return TPointerEvents.visible;
            case "painted"          : return TPointerEvents.painted;
            case "fill"             : return TPointerEvents.fill;
            case "stroke"           : return TPointerEvents.stroke;
            case "all"              : return TPointerEvents.all;
            case "none"             : return TPointerEvents.none;
            case "inherit"          : return TPointerEvents.inherit;
        }

        return TPointerEvents.visiblePainted;
    }

    set shapeRendering(shapeRendering: TShapeRendering) {
        this.set("shape-rendering",String(shapeRendering));
    }

    get shapeRendering() : TShapeRendering {
        var value = this.get("shape-rendering");
        
        switch(value) {
            case "auto"                 : return TShapeRendering.auto;
            case "optimizeSpeed"        : return TShapeRendering.optimizeSpeed;
            case "crispEdges"           : return TShapeRendering.crispEdges;
            case "geometricPrecision"   : return TShapeRendering.geometricPrecision;
            case "inherit"              : return TShapeRendering.inherit;
        }

        return TShapeRendering.auto;
    }

    set stroke(stroke : string) {
        this.set("stroke",stroke);
    }

    get stroke() {
        return this.get("stroke");
    }

    set strokeDasharray(strokeDasharray : TDashArray) {
        if( typeof strokeDasharray === "string" ) {
            this.set("stroke-dasharray",String(strokeDasharray));
        } else {
            this.set("stroke-dasharray",strokeDasharray.join(","));
        }
    }

    get strokeDasharray() : TDashArray {
        var value = this.get("stroke-dasharray");

        if( value == "none" ) {
            return "none";
        } else if( value == "inherit" ) {
            return "inherit";
        }
        return value.split(",").map( v => Number(v) );
    }

    get strokeDashoffset() : TLength {
        var v = this.get("stroke-dashoffset");
        return v ? v : 0;
    }

    set strokeDashoffset(strokeDashoffset: TLength) {
        if( TLengthUtils.isValid(strokeDashoffset,true) ) {
            this.set("stroke-dashoffset",String(strokeDashoffset));
        } else {
            console.log("Invalid length value '",strokeDashoffset,"'");
        }
    }

    set strokeLinecap(strokeLinecap : TStrokeLineCap) {
        this.set("stroke-linecap",String(strokeLinecap));
    }

    get strokeLinecap() {
        var v = this.get("stroke-linecap");
        switch(v) {
            case "butt"     : return TStrokeLineCap.butt;
            case "round"    : return TStrokeLineCap.round;
            case "square"   : return TStrokeLineCap.square;
            case "inherit"  : return TStrokeLineCap.inherit;
        }
        return TStrokeLineCap.butt;
    }

    set strokeLinejoin( strokeLinejoin: TStrokeLinejoin ) {
        this.set("stroke-linejoin",String(strokeLinejoin));
    }

    get strokeLinejoin() : TStrokeLinejoin {
        var v = this.get("stroke-linejoin");
        switch(v) {
            case "miter" : return TStrokeLinejoin.miter;
            case "round" : return TStrokeLinejoin.round;
            case "bevel" : return TStrokeLinejoin.bevel;
            case "inherit" : return TStrokeLinejoin.inherit;
        }

        return TStrokeLinejoin.miter;
    }

    // stroke-miterlimit

    set strokeOpacity(strokeOpacity: TNumberOrInherit) {
        this.set("stroke-opacity",String(strokeOpacity));
    }

    get strokeOpacity() {
        var v = this.get("stroke-opacity");
        if( v == "inherit" ) {
            return "inherit";
        }
        return v ? Number(v) : 1;
    }

    set strokeWidth(strokeWidth: TLength) {
        if( TLengthUtils.isValid(strokeWidth,true) ) {
            this.set("stroke-width",String(strokeWidth));
        } else {
            console.log("Invalid length value '",strokeWidth,"'");
        }
    }

    get strokeWidth() : TLength {
        return this.get("stroke-width");
    }
}

export class TRect extends TShape {
    constructor() {
        super("rect");
    }

    get x() : TLength {
        return this.get("x");
    }

    set x( x : TLength) {
        if( TLengthUtils.isValid(x) ) {
            this.set("x",String(x));
        } else {
            console.log("Invalid length value '",x,"'");
        }
    }

    get y() : TLength {
        return this.get("y");
    }

    set y( y : TLength) {
        if( TLengthUtils.isValid(y) ) {
            this.set("y",String(y));
        } else {
            console.log("Invalid length value '",y,"'");
        }
    }

    get width() : TLength {
        return this.get("width");
    }

    set width( width : TLength) {
        if( TLengthUtils.isValid(width) ) {
            this.set("width",String(width));
        } else {
            console.log("Invalid length value '",width,"'");
        }
    }

    get height() : TLength {
        return this.get("height");
    }

    set height( height : TLength) {
        if( TLengthUtils.isValid(height) ) {
            this.set("height",String(height));
        } else {
            console.log("Invalid length value '",height,"'");
        }
    }

    get rx() : TLength {
        return this.get("rx");
    }

    set rx( rx : TLength) {
        if( TLengthUtils.isValid(rx) ) {
            this.set("rx",String(rx));
        } else {
            console.log("Invalid length value '",rx,"'");
        }
    }

    get ry() : TLength {
        return this.get("ry");
    }

    set ry( ry : TLength) {
        if( TLengthUtils.isValid(ry) ) {
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

export class TCircle extends TShape {
    constructor() {
        super("circle");
    }

    get cx() {
        return this.get("cx");
    }

    set cx(cx : TLength) {
        if( TLengthUtils.isValid(cx) ) {
            this.set("cx",String(cx));
        } else {
            console.log("Invalid length value '",cx,"'");
        }
    }

    get cy() {
        return this.get("cy");
    }

    set cy(cy : TLength) {
        if( TLengthUtils.isValid(cy) ) {
            this.set("cy",String(cy));
        } else {
            console.log("Invalid length value '",cy,"'");
        }
    }

    get r() {
        return this.get("r");
    }

    set r(r : TLength) {
        if( TLengthUtils.isValid(r) ) {
            this.set("r",String(r));
        } else {
            console.log("Invalid length value '",r,"'");
        }
    }
}

export class TEllipse extends TShape {
    constructor() {
        super("ellipse");
    }

    get cx() {
        return this.get("cx");
    }

    set cx(cx : TLength) {
        if( TLengthUtils.isValid(cx) ) {
            this.set("cx",String(cx));
        } else {
            console.log("Invalid length value '",cx,"'");
        }
    }

    get cy() {
        return this.get("cy");
    }

    set cy(cy : TLength) {
        if( TLengthUtils.isValid(cy) ) {
            this.set("cy",String(cy));
        } else {
            console.log("Invalid length value '",cy,"'");
        }
    }

    get rx() {
        return this.get("rx");
    }

    set rx(rx : TLength) {
        if( TLengthUtils.isValid(rx) ) {
            this.set("cx",String(rx));
        } else {
            console.log("Invalid length value '",rx,"'");
        }
    }

    get ry() {
        return this.get("ry");
    }

    set ry(ry : TLength) {
        if( TLengthUtils.isValid(ry) ) {
            this.set("cy",String(ry));
        } else {
            console.log("Invalid length value '",ry,"'");
        }
    }

}