import {NSVGNode} from "./../../../svg/scene/NSVGNode";
import {NGText, Text} from "./../../../scene/text/Text";
import {Paint} from "../../../scene/paint/Paint";
import {Color} from "../../../scene/paint/Color";
import {LinearGradient} from "../../../scene/paint/LinearGradient";
import {Utils} from "../../../util/Utils";
import {RadialGradient} from "../../../scene/paint/RadialGradient";

export class NSVGText extends NSVGNode implements NGText {
    text: Text;
    dom: SVGGElement;
    textNode: SVGTextElement;
    private fill: Paint;
    private stroke: Paint;


    constructor(text: Text) {
        super();
        this.text     = text;
        this.dom      = NSVGNode.createGElement();
        this.textNode = NSVGNode.createTextElement();
        this.textNode.setAttribute("font-family", "Roboto");
        this.textNode.setAttribute("font-size", "15px");
        this.textNode.setAttribute("x", "0");
        this.dom.appendChild(this.textNode);
    }


    getFill(): Paint {
        return this.fill;
    }

    setFill(fill: Paint) {
        this.fill = fill;
        if (fill instanceof Color) {
            var c = fill as Color;
            this.textNode.setAttribute("fill", c.toRGBAString());
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
            this.textNode.setAttribute("fill", "url(#" + lg.id + ")");
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
            this.textNode.setAttribute("fill", "url(#" + rg.id + ")");
        }
    }

    getStroke(): Paint {
        return this.stroke;
    }

    setStroke(stroke: Paint) {
        this.stroke = stroke;
        if (stroke instanceof Color) {
            var c = stroke as Color;
            this.textNode.setAttribute("stroke", c.toRGBAString());
            //this.textNode.setAttribute("stroke-opacity", String(c.opacity));
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
            this.textNode.setAttribute("stroke", "url(#" + lg.id + ")");
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
        this.textNode.setAttribute("x", this.textNode.getBBox().x * -1 + "");
        this.textNode.setAttribute("y", this.textNode.getBBox().y * -1 + "");
        while (this.textNode.firstChild) {
            this.textNode.removeChild(this.textNode.firstChild);
        }

        if (this.text.text) {
            var t = document.createTextNode(this.text.text);
            this.textNode.appendChild(t);
        } else {

        }

        if (this.text.width) {
            this.textNode.setAttribute("width", this.text.width + "");
        }

        if (this.text.height) {
            this.textNode.setAttribute("height", this.text.height + "");
        }
    }
}
