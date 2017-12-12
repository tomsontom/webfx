import { NSVGNode } from "./../../../svg/scene/NSVGNode";
import { NGText, Text } from "./../../../scene/text/Text";

export class NSVGText extends NSVGNode implements NGText {
    text : Text;
    dom : SVGGElement;
    textNode : SVGTextElement;

    constructor(text : Text) {
        super();
        this.text = text;
        this.dom = NSVGNode.createGElement();
        this.textNode = NSVGNode.createTextElement();
        this.textNode.setAttribute("font-family","Roboto");
        this.textNode.setAttribute("font-size","15px");
        this.textNode.setAttribute("x","0");
        this.dom.appendChild(this.textNode);
    }

    prefHeight(width: number) {
        console.log("prefheight - bbox:", this.textNode.getBBox());
        console.log("prefheight - clientrect:", this.textNode.getBoundingClientRect());
        return this.textNode.getBBox().height;
    }

    prefWidth(height: number) {
        return this.textNode.getBBox().width;
    }

    getDom() {
        return this.dom;
    }

    sync() {
        this.textNode.setAttribute("x", this.textNode.getBBox().x*-1+"");
        this.textNode.setAttribute("y",this.textNode.getBBox().y*-1+"");
        while( this.textNode.firstChild ) {
            this.textNode.removeChild(this.textNode.firstChild);
        }

        if( this.text.text ) {
            var t = document.createTextNode(this.text.text);
            this.textNode.appendChild(t);
        } else {

        }

        if( this.text.width ) {
            this.textNode.setAttribute("width",this.text.width+"");
        }
        
        if( this.text.height ) {
            this.textNode.setAttribute("height",this.text.height+"");
        }
    }
}