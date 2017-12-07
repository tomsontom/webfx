
namespace svgscene {
    export abstract class NSVGNode implements scene.NGNode {
        static ns = 'http://www.w3.org/2000/svg';

        static createGElement() : SVGGElement {
            return document.createElementNS(NSVGNode.ns, 'g') as SVGAElement;
        }

        static createRectElement() : SVGRectElement {
            return document.createElementNS(NSVGNode.ns, 'rect') as SVGRectElement;
        }

        static createDefsElement() : SVGDefsElement {
            return document.createElementNS(NSVGNode.ns, 'defs') as SVGDefsElement;
        }

        static createLinearGradientElement() : SVGLinearGradientElement {
            return document.createElementNS(NSVGNode.ns, 'linearGradient') as SVGLinearGradientElement;
        }

        static createStopElement() : SVGStopElement {
            return document.createElementNS(NSVGNode.ns, 'stop') as SVGStopElement;
        }

        static createTextElement() : SVGTextElement {
            return document.createElementNS(NSVGNode.ns, 'text') as SVGTextElement;
        }

        abstract getDom() : SVGGElement;

        sync() {
            
        }
    }
}
