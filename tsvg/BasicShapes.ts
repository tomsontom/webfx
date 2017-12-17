import { TNode } from "./Base";

export class TSVGRect extends TNode {
    constructor() {
        super("rect");
    }

    get x() : string {
        return this.get("x");
    }

    set x( x : string) {
        this.set("x",x);
    }

    get y() : string {
        return this.get("y");
    }

    set y( y : string) {
        this.set("y",y);
    }

    get width() : string {
        return this.get("width");
    }

    set width( width : string) {
        this.set("width",width);
    }

    get height() : string {
        return this.get("height");
    }

    set height( height : string) {
        this.set("height",height);
    }

    get rx() : string {
        return this.get("rx");
    }

    set rx( rx : string) {
        this.set("rx",rx);
    }

    get ry() : string {
        return this.get("ry");
    }

    set ry( ry : string) {
        this.set("ry",ry);
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
