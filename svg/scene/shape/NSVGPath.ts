namespace svgscene.shape {

    export class NSVGPath extends NSVGNode {
        path     : scene.shape.Path;
        dom      : SVGGElement;
        pathNode : SVGPathElement;
        currentX : number;
        currentY : number;




        addMoveTo(x : number, y : number) : void {

        }

        addLineTo(x : number, y : number) : void {

        }

        addQuadTo(ctrlX : number, ctrlY : number, x : number, y : number) : void {

        }

        addCubicTo(ctrlX1 : number, ctrlY1 : number, ctrlX2 : number, ctrlY2 : number, x : number, y : number) : void {

        }

        addCloseTo() {

        }

        getDom(): SVGGElement {
            return this.dom;
        }
    }
}