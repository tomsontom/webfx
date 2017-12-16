import {NSVGNode} from "./../NSVGNode";
import {Paint} from "../../../scene/paint/Paint";
import {Color} from "../../../scene/paint/Color";
import {LinearGradient} from "../../../scene/paint/LinearGradient";
import {Utils} from "../../../util/Utils";
import {RadialGradient} from "../../../scene/paint/RadialGradient";
import {Shape} from "../../../scene/shape/Shape";
import {FillRule, Path} from "../../../scene/shape/Path";


export class NSVGPath extends NSVGNode {
    currentX       : number;
    currentY       : number;
    path           : Path;
    dom            : SVGGElement;
    defs           : SVGDefsElement;
    pathNode       : SVGPathElement;
    private fill   : Paint;
    private stroke : Paint;


    constructor(path: Path) {
        super();
        this.currentX = 0;
        this.currentY = 0;
        this.fill     = Color.BLACK;
        this.stroke   = Color.BLACK;
        this.path     = path;

        this.dom = NSVGNode.createGElement();

        this.defs = NSVGNode.createDefsElement();
        this.defs.setAttribute("id", "defs_" + this.path.id);

        this.pathNode = NSVGNode.createPathElement();
        this.pathNode.setAttribute("d", "");

        this.dom.appendChild(this.defs);
        this.dom.appendChild(this.pathNode);
    }


    addMoveTo(x: number, y: number): void {
        let d = this.pathNode.getAttribute("d");
        d += "M " + x + " " + y + " ";
        this.pathNode.setAttribute("d", d);
        this.currentX = x;
        this.currentY = y;
    }

    addLineTo(x: number, y: number): void {
        let d = this.pathNode.getAttribute("d");
        d += "L " + x + " " + y + " ";
        this.pathNode.setAttribute("d", d);
        this.currentX = x;
        this.currentY = y;
    }

    addQuadTo(ctrlX: number, ctrlY: number, x: number, y: number): void {
        let d = this.pathNode.getAttribute("d");
        d += "Q " + ctrlX + " " + ctrlY + " " + x + " " + y + " ";
        this.pathNode.setAttribute("d", d);
        this.currentX = x;
        this.currentY = y;
    }

    addCubicTo(ctrlX1: number, ctrlY1: number, ctrlX2: number, ctrlY2: number, x: number, y: number): void {
        let d = this.pathNode.getAttribute("d");
        d += "C " + ctrlX1 + " " + ctrlY1 + " " + ctrlX2 + " " + ctrlY2 + " " + x + " " + y + " ";
        this.pathNode.setAttribute("d", d);
        this.currentX = x;
        this.currentY = y;
    }

    addArcTo(radiusX: number, radiusY: number, xAxisRotate: number, largeArcFlag: boolean, sweepFlag: boolean, x: number, y: number): void {
        let d = this.pathNode.getAttribute("d");
        d += "A " + radiusX + " " + radiusY + " " + xAxisRotate + " " + (largeArcFlag ? "1" : "0") + " " +
             (sweepFlag ? "1" : "0") + " " + x + " " + y + " ";
        this.pathNode.setAttribute("d", d);
        this.currentX = x;
        this.currentY = y;
    }

    addClosePath() {
        let d = this.pathNode.getAttribute("d");
        d += "Z ";
        this.pathNode.setAttribute("d", d);
    }

    getFill(): Paint {
        return this.fill;
    }

    setFill(fill: Paint) {
        this.fill = fill;
        if (fill instanceof Color) {
            var c = fill as Color;
            this.pathNode.setAttribute("fill", c.toRGBAString());
            //this.pathNode.setAttribute("fill-opacity", String(c.opacity));
        } else if (fill instanceof LinearGradient) {
            var lg    = fill as LinearGradient;
            var svgLg = NSVGNode.createLinearGradientElement();
            svgLg.setAttribute("x1", Utils.proportionalize(lg.startX, lg.proportional));
            svgLg.setAttribute("x2", Utils.proportionalize(lg.endX, lg.proportional));
            svgLg.setAttribute("y1", Utils.proportionalize(lg.startY, lg.proportional));
            svgLg.setAttribute("y2", Utils.proportionalize(lg.endY, lg.proportional));
            svgLg.setAttribute("id", lg.id);

            lg.stops.map((stop) => {
                var s = NSVGNode.createStopElement();
                s.setAttribute("offset", Utils.proportionalize(stop.offset, lg.proportional));
                s.setAttribute("stop-color", stop.color.toRGBAString());
                return s;
            })
                .forEach((stop) => {
                    svgLg.appendChild(stop);
                });
            this.defs.appendChild(svgLg);
            this.pathNode.setAttribute("fill", "url(#" + lg.id + ")");
        } else if (fill instanceof RadialGradient) {
            var rg    = fill as RadialGradient;
            var fx    = rg.focusDistance * Math.cos(rg.focusAngle) + rg.centerX;
            var fy    = rg.focusDistance * Math.sin(rg.focusAngle) + rg.centerY;
            var svgRg = NSVGNode.createRadialGradientElement();
            svgRg.setAttribute("cx", Utils.proportionalize(rg.centerX, rg.proportional));
            svgRg.setAttribute("cy", Utils.proportionalize(rg.centerY, rg.proportional));
            svgRg.setAttribute("r", Utils.proportionalize(rg.radius, rg.proportional));
            svgRg.setAttribute("fx", Utils.proportionalize(fx, rg.proportional));
            svgRg.setAttribute("fy", Utils.proportionalize(fy, rg.proportional));
            svgRg.setAttribute("id", rg.id);
            rg.stops.map((stop) => {
                var s = NSVGNode.createStopElement();
                s.setAttribute("offset", Utils.proportionalize(stop.offset, rg.proportional));
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

    getStroke(): Paint {
        return this.stroke;
    }

    setStroke(stroke: Paint) {
        this.stroke = stroke;
        if (stroke instanceof Color) {
            var c = stroke as Color;
            this.pathNode.setAttribute("stroke", c.toRGBAString());
            //this.pathNode.setAttribute("stroke-opacity", String(c.opacity));
        } else if (stroke instanceof LinearGradient) {
            var lg    = stroke as LinearGradient;
            var svgLg = NSVGNode.createLinearGradientElement();
            svgLg.setAttribute("x1", Utils.proportionalize(lg.startX, lg.proportional));
            svgLg.setAttribute("x2", Utils.proportionalize(lg.endX, lg.proportional));
            svgLg.setAttribute("y1", Utils.proportionalize(lg.startY, lg.proportional));
            svgLg.setAttribute("y2", Utils.proportionalize(lg.endY, lg.proportional));
            svgLg.setAttribute("id", lg.id);

            lg.stops.map((stop) => {
                var s = NSVGNode.createStopElement();
                s.setAttribute("offset", Utils.proportionalize(stop.offset, lg.proportional));
                s.setAttribute("stop-color", stop.color.toRGBAString());
                return s;
            })
                .forEach((stop) => {
                    svgLg.appendChild(stop);
                });
            this.defs.appendChild(svgLg);
            this.pathNode.setAttribute("stroke", "url(#" + lg.id + ")");
        } else if (stroke instanceof RadialGradient) {
            var rg    = stroke as RadialGradient;
            var fx    = rg.focusDistance * Math.cos(rg.focusAngle) + rg.centerX;
            var fy    = rg.focusDistance * Math.sin(rg.focusAngle) + rg.centerY;
            var svgRg = NSVGNode.createRadialGradientElement();
            svgRg.setAttribute("cx", Utils.proportionalize(rg.centerX, rg.proportional));
            svgRg.setAttribute("cy", Utils.proportionalize(rg.centerY, rg.proportional));
            svgRg.setAttribute("r", Utils.proportionalize(rg.radius, rg.proportional));
            svgRg.setAttribute("fx", Utils.proportionalize(fx, rg.proportional));
            svgRg.setAttribute("fy", Utils.proportionalize(fy, rg.proportional));
            svgRg.setAttribute("id", rg.id);
            rg.stops.map((stop) => {
                var s = NSVGNode.createStopElement();
                s.setAttribute("offset", Utils.proportionalize(stop.offset, rg.proportional));
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

    reset(): void {
        this.pathNode.setAttribute("d", "");
    }

    update(): void {
        this.sync()
    }

    setFillRule(fillRule: FillRule): void {
        this.pathNode.setAttribute("fill-rule", fillRule == FillRule.EVEN_ODD ? "evenodd" : "nonzero");
    }

    getGeometry(): Path {
        return this.path;
    }

    getShape(): Shape {
        return null//this.path;
    }

    acceptsPath2dOnUpdate(): boolean {
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
        //this.dom.setAttribute("x", String(this.pathNode.getBBox().x * -1));
        //this.dom.setAttribute("y", String(this.pathNode.getBBox().y * -1));

        while (this.pathNode.firstChild) {
            this.pathNode.removeChild(this.pathNode.firstChild);
        }

        if (this.path.width) {
            this.pathNode.setAttribute("width", this.path.width + "");
        }

        if (this.path.height) {
            this.pathNode.setAttribute("height", this.path.height + "");
        }

    }
}