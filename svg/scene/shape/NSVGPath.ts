namespace svgscene.shape {

    export class NSVGPath extends NSVGNode {
        currentX : number;
        currentY : number;
        path     : scene.shape.Path;
        pathNode : SVGPathElement;


        constructor(path : scene.shape.Path) {
            super();
            this.currentX = 0;
            this.currentY = 0;
            this.path     = path;
            this.pathNode = NSVGNode.createPathElement();
            this.pathNode.setAttribute("d","");
        }


        addMoveTo(x : number, y : number) : void {
            let d = this.pathNode.getAttribute("d");
            d += "M " + x + " " + y + " ";
            this.pathNode.setAttribute("d", d);
            this.currentX = x;
            this.currentY = y;
        }

        addLineTo(x : number, y : number) : void {
            let d = this.pathNode.getAttribute("d");
            d += "L " + x + " " + y + " ";
            this.pathNode.setAttribute("d", d);
            this.currentX = x;
            this.currentY = y;
        }

        addQuadTo(ctrlX : number, ctrlY : number, x : number, y : number) : void {
            let d = this.pathNode.getAttribute("d");
            d += "Q " + ctrlX + " " + ctrlY + " " + x + " " + y + " ";
            this.pathNode.setAttribute("d", d);
            this.currentX = x;
            this.currentY = y;
        }

        addCubicTo(ctrlX1 : number, ctrlY1 : number, ctrlX2 : number, ctrlY2 : number, x : number, y : number) : void {
            let d = this.pathNode.getAttribute("d");
            d += "C " + ctrlX1 + " " + ctrlY1 + " " + ctrlX2 + " " + ctrlY2 + " "+ x + " " + y + " ";
            this.pathNode.setAttribute("d", d);
            this.currentX = x;
            this.currentY = y;
        }

        addArcTo(radiusX : number, radiusY : number, xAxisRotate : number, largeArcFlag : boolean,
                 sweepFlag : boolean, x : number, y : number) :void {
            let d = this.pathNode.getAttribute("d");
            d += "A " + radiusX + " " + radiusY + " " + xAxisRotate + " " + (largeArcFlag ? "1" : "0") + " " + (sweepFlag ? "1" : "0") + " " + x + " " + y + " ";
            this.pathNode.setAttribute("d", d);
            this.currentX = x;
            this.currentY = y;
        }

        addClosePath() {
            let d = this.pathNode.getAttribute("d");
            d += "Z ";
            this.pathNode.setAttribute("d", d);
        }

        reset() : void {
            this.pathNode.setAttribute("d", "");
        }

        update() : void {
            this.sync()
        }

        setFillRule(fillRule : scene.shape.FillRule) : void {
            this.pathNode.setAttribute("fill-rule", fillRule == scene.shape.FillRule.EVEN_ODD ? "evenodd" : "nonzero");
        }

        getGeometry() : scene.shape.Path {
            return this.path;
        }


        getShape() : scene.shape.Shape {
            return null//this.path;
        }

        acceptsPath2dOnUpdate() : boolean {
            return true;
        }

        prefHeight(width: number) {
            return this.pathNode.getBBox().height;
        }

        prefWidth(height: number) {
            return this.pathNode.getBBox().width;
        }

        getDom(): SVGGElement {
            return this.pathNode;
        }

        sync() {
            this.pathNode.setAttribute("x", this.pathNode.getBBox().x*-1+"");
            this.pathNode.setAttribute("y",this.pathNode.getBBox().y*-1+"");
            while( this.pathNode.firstChild ) {
                this.pathNode.removeChild(this.pathNode.firstChild);
            }

            if( this.path.width ) {
                this.pathNode.setAttribute("width",this.path.width+"");
            }

            if( this.path.height ) {
                this.pathNode.setAttribute("height",this.path.height+"");
            }

        }
    }
}