namespace svgscene.shape {

    export class NSVGPath extends NSVGNode {
        path     : scene.shape.Path;
        dom      : SVGGElement;
        pathNode : SVGPathElement;



        getDom(): SVGGElement {
            return this.dom;
        }
    }
}