import {NGShape, Shape} from "./Shape";
import {NSVGPath} from "../../svg/scene/shape/NSVGPath";
import {Paint} from "../paint/Paint";
import {NGNode} from "../Node";
import {MoveTo, PathElement} from "./PathElement";

export enum FillRule {
    NON_ZERO, EVEN_ODD
}

export interface NGPath extends NGShape {
    prefWidth(height: number): number;

    prefHeight(width: number): number;
}

export class Path extends Shape implements NGPath {
    static count   : number = 0;
           id      : string;
           ng      : NSVGPath;
           elements: PathElement[];
           fillRule: FillRule;
           width   : number;
           height  : number;


    constructor();
    constructor(elements: PathElement[]);
    constructor(elements?: PathElement[]) {
        super();
        this.ng = new NSVGPath(this);
        if (elements === undefined) {
            this.elements = [];
        } else {
            this.elements = elements;
        }
        this.id = "Path_" + (Path.count++);
    }


    markPathDirty() {

    }

    add(element: PathElement) {
        this.elements.push(element);
        element.addTo(this.ng);
        this.ng.sync();
    }

    addAll(elements: PathElement[]) {
        this.elements.concat(elements);
        this.elements.forEach((element: PathElement, i: number) => {
            element.addTo(this.ng);
        });
        this.ng.sync();
    }

    private isFirstPathElementValid(): boolean {
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

    prefHeight(width: number): number {
        return this.ng.prefHeight(width);
    }

    prefWidth(height: number): number {
        return this.ng.prefWidth(height);
    }

    getFill() {
        return this.ng.getFill();
    }

    setFill(fill: Paint) {
        console.log("Path: setFill() " + fill);
        this.fill = fill;
        this.ng.setFill(fill);
    }

    getStroke() {
        return this.ng.getStroke();
    }

    setStroke(stroke: Paint) {
        this.stroke = stroke;
        this.ng.setStroke(stroke);
    }

    sync() {
        this.ng.sync();
    }

    getNgNode(): NGNode {
        return this.ng;
    }
}
