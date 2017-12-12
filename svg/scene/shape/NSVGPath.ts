namespace svgscene.shape {

    export class NSVGPath extends NSVGNode {
        currentX       : number;
        currentY       : number;
        path           : scene.shape.Path;
        pathNode       : SVGPathElement;
        private fill   : scene.paint.Paint;
        private stroke : scene.paint.Paint;


        constructor(path : scene.shape.Path) {
            super();
            this.currentX = 0;
            this.currentY = 0;
            this.fill     = scene.paint.Color.BLACK;
            this.stroke   = scene.paint.Color.BLACK;
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

        getFill() : scene.paint.Paint { return this.fill; }
        setFill(fill : scene.paint.Paint) {
            this.fill = fill;
            if (fill instanceof scene.paint.Color) {

            } else if (fill instanceof scene.paint.LinearGradient) {
                var lg     = fill as scene.paint.LinearGradient;
                var e      = NSVGNode.createLinearGradientElement();
                var suffix = lg.proportional ? "%" : "";
                e.setAttribute("x1", util.Utils.proportionalize(lg.startX, lg.proportional));
                e.setAttribute("x2", util.Utils.proportionalize(lg.endX, lg.proportional));
                e.setAttribute("y1", util.Utils.proportionalize(lg.startY, lg.proportional));
                e.setAttribute("y2", util.Utils.proportionalize(lg.endY, lg.proportional));
                e.setAttribute("id", lg.id);

                lg.stops.map((stop) => {
                    var s = NSVGNode.createStopElement();
                    s.setAttribute("offset", util.Utils.proportionalize(stop.offset, lg.proportional));
                    s.setAttribute("stop-color", stop.color.toRGBAString());
                    return s;
                })
                .forEach((stop) => {
                    e.appendChild(stop);
                });
            } else if (fill instanceof scene.paint.RadialGradient) {

            }
        }

        getStroke() : scene.paint.Paint { return this.stroke; }
        setStroke(stroke : scene.paint.Paint) {
            this.stroke = stroke;
            if (stroke instanceof scene.paint.Color) {

            } else if (stroke instanceof scene.paint.LinearGradient) {

            } else if (stroke instanceof scene.paint.RadialGradient) {

            }
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