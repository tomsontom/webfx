namespace svgscene.shape {

    export class NSVGPath extends NSVGNode {
        currentX       : number;
        currentY       : number;
        path           : scene.shape.Path;
        dom            : SVGGElement;
        defs           : SVGDefsElement;
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

            this.dom      = NSVGNode.createGElement();

            this.defs     = NSVGNode.createDefsElement();
            this.defs.setAttribute("id", "defs_" + this.path.id);

            this.pathNode = NSVGNode.createPathElement();
            this.pathNode.setAttribute("d","");

            this.dom.appendChild(this.defs);
            this.dom.appendChild(this.pathNode);
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
                var c = fill as scene.paint.Color;
                this.pathNode.setAttribute("fill", c.toRGBAString());
                //this.pathNode.setAttribute("fill-opacity", String(c.opacity));
            } else if (fill instanceof scene.paint.LinearGradient) {
                var lg    = fill as scene.paint.LinearGradient;
                var svgLg = NSVGNode.createLinearGradientElement();
                svgLg.setAttribute("x1", util.Utils.proportionalize(lg.startX, lg.proportional));
                svgLg.setAttribute("x2", util.Utils.proportionalize(lg.endX, lg.proportional));
                svgLg.setAttribute("y1", util.Utils.proportionalize(lg.startY, lg.proportional));
                svgLg.setAttribute("y2", util.Utils.proportionalize(lg.endY, lg.proportional));
                svgLg.setAttribute("id", lg.id);

                lg.stops.map((stop) => {
                    var s = NSVGNode.createStopElement();
                    s.setAttribute("offset", util.Utils.proportionalize(stop.offset, lg.proportional));
                    s.setAttribute("stop-color", stop.color.toRGBAString());
                    return s;
                })
                .forEach((stop) => {
                    svgLg.appendChild(stop);
                });
                this.defs.appendChild(svgLg);
                this.pathNode.setAttribute("fill", "url(#" + lg.id + ")");
            } else if (fill instanceof scene.paint.RadialGradient) {
                var rg    = fill as scene.paint.RadialGradient;
                var fx    = rg.focusDistance*Math.cos(rg.focusAngle) + rg.centerX;
                var fy    = rg.focusDistance*Math.sin(rg.focusAngle) + rg.centerY;
                var svgRg = NSVGNode.createRadialGradientElement();
                svgRg.setAttribute("cx", util.Utils.proportionalize(rg.centerX, rg.proportional));
                svgRg.setAttribute("cy", util.Utils.proportionalize(rg.centerY, rg.proportional));
                svgRg.setAttribute("r", util.Utils.proportionalize(rg.radius, rg.proportional));
                svgRg.setAttribute("fx", util.Utils.proportionalize(fx, rg.proportional));
                svgRg.setAttribute("fy", util.Utils.proportionalize(fy, rg.proportional));
                svgRg.setAttribute("id", rg.id);
                rg.stops.map((stop) => {
                    var s = NSVGNode.createStopElement();
                    s.setAttribute("offset", util.Utils.proportionalize(stop.offset, rg.proportional));
                    s.setAttribute("stop-color", stop.color.toRGBAString());
                    return s;
                })
                .forEach((stop) => {
                    svgRg.appendChild(stop);
                });
                this.defs.appendChild(svgRg);
                this.pathNode.setAttribute("fill", "url(#" + rg.id + ")");
            }
        }

        getStroke() : scene.paint.Paint { return this.stroke; }
        setStroke(stroke : scene.paint.Paint) {
            this.stroke = stroke;
            if (stroke instanceof scene.paint.Color) {
                var c = stroke as scene.paint.Color;
                this.pathNode.setAttribute("stroke", c.toRGBAString());
                //this.pathNode.setAttribute("stroke-opacity", String(c.opacity));
            } else if (stroke instanceof scene.paint.LinearGradient) {
                var lg    = stroke as scene.paint.LinearGradient;
                var svgLg = NSVGNode.createLinearGradientElement();
                svgLg.setAttribute("x1", util.Utils.proportionalize(lg.startX, lg.proportional));
                svgLg.setAttribute("x2", util.Utils.proportionalize(lg.endX, lg.proportional));
                svgLg.setAttribute("y1", util.Utils.proportionalize(lg.startY, lg.proportional));
                svgLg.setAttribute("y2", util.Utils.proportionalize(lg.endY, lg.proportional));
                svgLg.setAttribute("id", lg.id);

                lg.stops.map((stop) => {
                    var s = NSVGNode.createStopElement();
                    s.setAttribute("offset", util.Utils.proportionalize(stop.offset, lg.proportional));
                    s.setAttribute("stop-color", stop.color.toRGBAString());
                    return s;
                })
                    .forEach((stop) => {
                        svgLg.appendChild(stop);
                    });
                this.defs.appendChild(svgLg);
                this.pathNode.setAttribute("stroke", "url(#" + lg.id + ")");
            } else if (stroke instanceof scene.paint.RadialGradient) {
                var rg    = stroke as scene.paint.RadialGradient;
                var fx    = rg.focusDistance*Math.cos(rg.focusAngle) + rg.centerX;
                var fy    = rg.focusDistance*Math.sin(rg.focusAngle) + rg.centerY;
                var svgRg = NSVGNode.createRadialGradientElement();
                svgRg.setAttribute("cx", util.Utils.proportionalize(rg.centerX, rg.proportional));
                svgRg.setAttribute("cy", util.Utils.proportionalize(rg.centerY, rg.proportional));
                svgRg.setAttribute("r", util.Utils.proportionalize(rg.radius, rg.proportional));
                svgRg.setAttribute("fx", util.Utils.proportionalize(fx, rg.proportional));
                svgRg.setAttribute("fy", util.Utils.proportionalize(fy, rg.proportional));
                svgRg.setAttribute("id", rg.id);
                rg.stops.map((stop) => {
                    var s = NSVGNode.createStopElement();
                    s.setAttribute("offset", util.Utils.proportionalize(stop.offset, rg.proportional));
                    s.setAttribute("stop-color", stop.color.toRGBAString());
                    return s;
                })
                    .forEach((stop) => {
                        svgRg.appendChild(stop);
                    });
                this.defs.appendChild(svgRg);
                this.pathNode.setAttribute("stroke", "url(#" + rg.id + ")");
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
            return this.dom;
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