
namespace svgscene.text {

    export class NSVGText extends NSVGNode implements scene.text.NGText {
        text           : scene.text.Text;
        dom            : SVGGElement;
        textNode       : SVGTextElement;
        private fill   : scene.paint.Paint;
        private stroke : scene.paint.Paint;


        constructor(text : scene.text.Text) {
            super();
            this.text     = text;
            this.dom      = NSVGNode.createGElement();
            this.textNode = NSVGNode.createTextElement();
            this.textNode.setAttribute("font-family","Roboto");
            this.textNode.setAttribute("font-size","15px");
            this.textNode.setAttribute("x","0");
            this.dom.appendChild(this.textNode);
        }


        getFill() : scene.paint.Paint { return this.fill; }
        setFill(fill : scene.paint.Paint) {
            this.fill = fill;
            if (fill instanceof scene.paint.Color) {
                var c = fill as scene.paint.Color;
                this.textNode.setAttribute("fill", c.toRGBAString());
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
                this.textNode.setAttribute("fill", "url(#" + lg.id + ")");
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
                this.textNode.setAttribute("fill", "url(#" + rg.id + ")");
            }
        }

        getStroke() : scene.paint.Paint { return this.stroke; }
        setStroke(stroke : scene.paint.Paint) {
            this.stroke = stroke;
            if (stroke instanceof scene.paint.Color) {
                var c = stroke as scene.paint.Color;
                this.textNode.setAttribute("stroke", c.toRGBAString());
                //this.textNode.setAttribute("stroke-opacity", String(c.opacity));
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
                this.textNode.setAttribute("stroke", "url(#" + lg.id + ")");
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
                this.textNode.setAttribute("stroke", "url(#" + rg.id + ")");
            }
        }

        prefHeight(width: number) {
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
}