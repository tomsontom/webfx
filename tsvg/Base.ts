export class TNode {
    static ns = 'http://www.w3.org/2000/svg';
    readonly domNode : Element;

    constructor(type : string) {
        this.domNode = document.createElementNS(TNode.ns, type);
        this.domNode["ts"] = this;
    }

    protected set(name : string, value : string) {
        this.domNode.setAttribute(name,value);
    }

    protected get(name : string) {
        return this.domNode.getAttribute(name);
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

    // transformable
    get transform() : string {
        return this.get("transform");
    }

    set transform(transform : string) {
        this.set("transform",transform);
    }
    
}

export class TDefsElement extends TNode {
    constructor() {
        super("defs");
    }
}

export class TForeignObject extends TNode {
    constructor() {
        super("foreignObject");
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

    // transformable
    get transform() : string {
        return this.get("transform");
    }

    set transform(transform : string) {
        this.set("transform",transform);
    }
}