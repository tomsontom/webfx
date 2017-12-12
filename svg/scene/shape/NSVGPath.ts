namespace svgscene.shape {

    export class NSVGPath extends NSVGNode {
        path     : scene.shape.Path;
        dom      : SVGGElement;
        pathNode : SVGPathElement;
        currentX : number;
        currentY : number;




        addMoveTo(x : number, y : number) : void {

        }

        getDom(): SVGGElement {
            return this.dom;
        }
    }
}