namespace scene.shape {
    export enum FillRule {
        NON_ZERO, EVEN_ODD
    }

    export interface NGPath extends scene.shape.NGShape {
        prefWidth(height: number) : number;
        prefHeight(width: number) : number;
    }

    export class Path extends Shape implements NGPath {
        ng       : svgscene.shape.NSVGPath;
        elements : PathElement[];
        fillRule : FillRule;
        width    : number;
        height   : number;


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

        resize(width: number, height: number) {
            this.width  = width;
            this.height = height;
            this.ng.sync();
        }

        prefHeight(width: number) : number {
            return this.ng.prefHeight(width);
        }

        prefWidth(height: number) : number {
            return this.ng.prefWidth(height);
        }

        sync() {
            this.ng.sync();
        }

        getNgNode(): scene.NGNode {
            return this.ng;
        }
    }
}