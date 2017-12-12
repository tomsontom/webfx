namespace scene.shape {
    export enum FillRule {
        NON_ZERO, EVEN_ODD
    }

    export class Path extends Shape {

        ng       : svgscene.shape.NSVGPath;
        elements : PathElement[];
        fillRule : FillRule;

        constructor();
        constructor(elements : PathElement[]);
        constructor(elements? : PathElement[]) {
            super();
            this.ng     = new svgscene.shape.NSVGPath(this);
            if (elements === undefined) {
                this.elements = [];
            } else {
                this.elements = elements;
            }
        }


        markPathDirty() {

        }

        add(element : PathElement) {
            this.elements.push(element);
            element.addTo(this.ng);
            /*
            switch(element.type) {
                case ElementType.MOVE_TO:
                    element.addTo(this.ng);
                    break;
                case ElementType.LINE_TO:
                    break;
                case ElementType.H_LINE_TO:
                    break;
                case ElementType.V_LINE_TO:
                    break;
                case ElementType.QUAD_TO:
                    break;
                case ElementType.CUBIC_TO:
                    break;
                case ElementType.ARC_TO:
                    break;
                case ElementType.MOVE_TO:
                    break;
                case ElementType.CLOSE:
                    break;
            }
            */
            this.ng.sync();
        }

        addAll(elements : PathElement[]) {
            this.elements.concat(elements);
            this.elements.forEach((element : scene.shape.PathElement, i : number) => {
                element.addTo(this.ng);
            });
            this.ng.sync();
        }

        private isFirstPathElementValid() : boolean{
            let _elements = this.elements;
            if (_elements != null && _elements.length > 0) {
                let firstElement = _elements[0];
                if (!firstElement.isAbsolute()) {
                    console.log("First element of the path can not be relative. Path: %s\n", this);
                    return false;
                } else if (firstElement instanceof MoveTo) {
                    return true;
                } else {
                    console.log("Missing initial moveto in path definition. Path: %s\n", this);
                    return false;
                }
            }
            return true;
        }

        getNgNode(): scene.NGNode {
            return this.ng;
        }
    }
}