
namespace svgscene.text {
    export class NSVGText extends svgscene.NSVGNode implements scene.text.NGText {
        text : scene.text.Text;
        dom : SVGGElement;
        textNode : SVGTextElement;

        constructor(text : scene.text.Text) {
            super();
            this.text = text;
            this.dom = NSVGNode.createGElement();
            this.textNode = NSVGNode.createTextElement();
            this.textNode.setAttribute("font-family","Roboto");
            this.textNode.setAttribute("font-size","15px");
            this.textNode.setAttribute("x","0");
            this.textNode.setAttribute("dominant-baseline","hanging");
            this.dom.appendChild(this.textNode);
        }

        prefHeight(width: number) {
            console.log("prefheight:", this.textNode.getBBox());
            return this.textNode.getBBox().height;
        }

        prefWidth(height: number) {
            return this.textNode.getBBox().width;
        }

        getDom() {
            return this.dom;
        }

        sync() {
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
}