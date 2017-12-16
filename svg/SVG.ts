export class TNode {
    static ns = 'http://www.w3.org/2000/svg';
    readonly domNode : Element;

    constructor(type : string) {
        this.domNode = document.createElementNS(TNode.ns, type);
        this.domNode["ts"] = this;
    }    
}

export class TSVGElement {

}

export class TSVGSVGStylable extends TNode {
}

export class TSVGTransformable extends TNode {
    
}

export class TSVGExternalResourcesRequired extends TNode {
     
}

export class TSVGLangSpace extends TNode {
    
}

export class TSVGRect extends TNode {
    constructor() {
        super("rect");
    }

    get x() : string {
        return this.domNode.getAttribute("x");
    }

    set x( x : string) {
        this.domNode.setAttribute("x",x);
    }

    get y() : string {
        return this.domNode.getAttribute("y");
    }

    set y( y : string) {
        this.domNode.setAttribute("y",y);
    }

    get width() : string {
        return this.domNode.getAttribute("width");
    }

    set width( width : string) {
        this.domNode.setAttribute("width",width);
    }

    get height() : string {
        return this.domNode.getAttribute("height");
    }

    set height( height : string) {
        this.domNode.setAttribute("height",height);
    }

    get rx() : string {
        return this.domNode.getAttribute("rx");
    }

    set rx( rx : string) {
        this.domNode.setAttribute("rx",rx);
    }

    get ry() : string {
        return this.domNode.getAttribute("ry");
    }

    set ry( ry : string) {
        this.domNode.setAttribute("ry",ry);
    }

    get fill() {
        return this.domNode.getAttribute("fill");
    }

    set fill( fill : string) {
        this.domNode.setAttribute("fill",fill);
    }

    // styleable
    get class() : string {
        return this.domNode.getAttribute("class");
    }

    set class( cl : string) {
        this.domNode.setAttribute("class",cl);
    }

    // transformable
    get transform() : string {
        return this.domNode.getAttribute("transform");
    }

    set transform(transform : string) {
        this.domNode.setAttribute("transform",transform);
    }

    // external resources required
    get externalResourcesRequired() : boolean {
        return Boolean(this.domNode.getAttribute("externalResourcesRequired"));
    }

    set externalResourcesRequired( externalResourcesRequired: boolean ) {
        this.domNode.setAttribute("externalResourcesRequired",String(externalResourcesRequired));
    }

    // xml-namespaces
    get xmllang() : string {
        return this.domNode.getAttribute("xmllang");
    }

    set xmllang(xmllang : string) {
        this.domNode.setAttribute("xmllang",xmllang);
    }

    get xmlspace() {
        return this.domNode.getAttribute("xmlspace");
    }

    set xmlspace(xmlspace: string) {
        this.domNode.setAttribute("xmlspace",xmlspace);
    }
}

export class TGElement extends TNode {
    constructor() {
        super("g");
    }

    add(node: TNode) {
        this.domNode.appendChild(node.domNode);
    }

    remove(node : TNode) {
        this.domNode.removeChild(node.domNode);
    }

    foreach( f : ( node: TNode ) => void ) {
        for( var i = 0; i < this.domNode.children.length; i++ ) {
            f.apply( this.domNode.children[i]["ts"]);
        }
    }
}

export class TDefsElement extends TNode {
    constructor() {
        super("defs");
    }
}