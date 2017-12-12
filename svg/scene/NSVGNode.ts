import {NGNode} from "./../../scene/Node";

export abstract class NSVGNode implements NGNode {
    static ns = 'http://www.w3.org/2000/svg';

    static createPathElement(): SVGPathElement {
        return document.createElementNS(NSVGNode.ns, 'path') as SVGPathElement;
    }

    static createGElement(): SVGGElement {
        return document.createElementNS(NSVGNode.ns, 'g') as SVGAElement;
    }

    static createRectElement(): SVGRectElement {
        return document.createElementNS(NSVGNode.ns, 'rect') as SVGRectElement;
    }

    static createDefsElement(): SVGDefsElement {
        return document.createElementNS(NSVGNode.ns, 'defs') as SVGDefsElement;
    }

    static createLinearGradientElement(): SVGLinearGradientElement {
        return document.createElementNS(NSVGNode.ns, 'linearGradient') as SVGLinearGradientElement;
    }

    static createRadialGradientElement(): SVGRadialGradientElement {
        return document.createElementNS(NSVGNode.ns, 'radialGradient') as SVGRadialGradientElement;
    }

    static createStopElement(): SVGStopElement {
        return document.createElementNS(NSVGNode.ns, 'stop') as SVGStopElement;
    }

    static createTextElement(): SVGTextElement {
        return document.createElementNS(NSVGNode.ns, 'text') as SVGTextElement;
    }

    static createForeignObjectElement(): SVGForeignObjectElement {
        return document.createElementNS(NSVGNode.ns, 'foreignObject') as SVGForeignObjectElement;
    }

    abstract getDom(): SVGGElement;

    sync() {
    }
}
