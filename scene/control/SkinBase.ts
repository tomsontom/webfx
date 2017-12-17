import {Skin} from "./Skin";
import {Control} from "./Control";
import {HPos} from "../../geometry/HPos";
import {VPos} from "../../geometry/VPos";
import {Insets} from "../../geometry/Insets";
import {Region} from "../layout/Region";
import {Node} from "./../Node";

export abstract class SkinBase<C extends Control> implements Skin<C> {
    control : C;
    children: Node[];


    protected constructor(control : C) {
        if (control == null) { throw new SyntaxError("Cannot pass null for control"); }

        this.control  = control;
        this.children = control.getControlChildren();
    }


    getSkinnable(): C {
        return this.control;
    }

    getNode(): Node {
        return this.control;
    }

    dispose() {
        this.control = null;
    }

    getChildren() : Node[] {
        return this.children;
    }

    layoutChildren(contentX : number, contentY : number, contentWidth : number, contentHeight : number) : void {
        for (let i : number = 0 ; i < this.children.length ; i++) {
            let child : Node = this.children[i];
            if (child.isManaged()) {
                this.layoutInArea(child, contentX, contentY, contentWidth, contentHeight, -1, Insets.EMPTY, true, true, HPos.CENTER, VPos.CENTER);
            }
        }
    }

    computeMinWidth(height : number, topInset : number, rightInset : number, bottomInset : number, leftInset : number) : number {
        let minX              : number  = 0;
        let maxX              : number  = 0;
        let firstManagedChild : boolean = true;
        for (let i : number = 0 ; i < this.children.length ; i++) {
            let node : Node = this.children[i];
            if (node.isManaged()) {
                let x : number = node.getLayoutBounds().minX + node.getLayoutX();
                if (!firstManagedChild) {
                    minX = Math.min(minX, x);
                    maxX = Math.max(maxX, x + node.minWidth(-1));
                } else {
                    minX = x;
                    maxX = x + node.minWidth(-1);
                    firstManagedChild = false;
                }
            }
        }
        let minWidth = maxX - minX;
        return leftInset + minWidth + rightInset;
    }

    computeMinHeight(width : number, topInset : number, rightInset : number, bottomInset : number, leftInset : number) : number {
        let minY              : number = 0;
        let maxY              : number = 0;
        let firstManagedChild : boolean = true;
        for (let i : number = 0 ; i < this.children.length ; i++) {
            let node : Node = this.children[i];
            if (node.isManaged()) {
                let y : number = node.getLayoutBounds().minY + node.getLayoutY();
                if (!firstManagedChild) {
                    minY = Math.min(minY, y);
                    maxY = Math.max(maxY, y + node.minHeight(-1));
                } else {
                    minY = y;
                    maxY = y + node.minHeight(-1);
                    firstManagedChild = false;
                }
            }
        }
        let minHeight = maxY - minY;
        return topInset + minHeight + bottomInset;
    }

    computeMaxWidth(height : number, topInset : number, rightInset : number, bottomInset : number, leftInset : number) : number {
        return Number.MAX_VALUE;
    }

    computeMaxHeight(width : number, topInset : number, rightInset : number, bottomInset : number, leftInset : number) : number {
        return Number.MAX_VALUE;
    }

    computePrefWidth(height : number, topInset : number, rightInset : number, bottomInset : number, leftInset : number) : number {
        let minX              : number  = 0;
        let maxX              : number  = 0;
        let firstManagedChild : boolean = true;
        for (let i : number = 0 ; i < this.children.length ; i++) {
            let node : Node = this.children[i];
            if (node.isManaged()) {
                let x : number = node.getLayoutBounds().minX + node.getLayoutX();
                if (!firstManagedChild) {
                    minX = Math.min(minX, x);
                    maxX = Math.max(maxX, x + node.prefWidth(-1));
                } else {
                    minX = x;
                    maxX = x + node.prefWidth(-1);
                    firstManagedChild = false;
                }
            }
        }
        return maxX - minX;
    }

    computePrefHeight(width : number, topInset : number, rightInset : number, bottomInset : number, leftInset : number) : number {
        let minY              : number  = 0;
        let maxY              : number  = 0;
        let firstManagedChild : boolean = true;
        for (let i : number = 0 ; i < this.children.length ; i++) {
            let node : Node = this.children[i];
            if (node.isManaged()) {
                let y : number = node.getLayoutBounds().minY + node.getLayoutY();
                if (!firstManagedChild) {
                    minY = Math.min(minY, y);
                    maxY = Math.max(maxY, y + node.prefHeight(-1));
                } else {
                    minY = y;
                    maxY = y + node.prefHeight(-1);
                    firstManagedChild = false;
                }
            }
        }
        return maxY - minY;
    }

    computeBaselineOffset(topInset : number, rightInset : number, bottomInset : number, leftInset : number) : number {
        for (let i = 0 ; i < this.children.length ; i++) {
            let node : Node = this.children[i];
            if (node.isManaged()) {
                let offset = node.getBaselineOffset();
                if (offset == Node.BASELINE_OFFSET_SAME_AS_HEIGHT) {
                    continue;
                }
                return node.getLayoutBounds().minY + node.getLayoutY() + offset;
            }
        }
        return Node.BASELINE_OFFSET_SAME_AS_HEIGHT;
    }

    snappedTopInset() : number {
        return this.control.snappedTopInset();
    }

    snappedRightInset() : number {
        return this.control.snappedRightInset();
    }

    snappedBottomInset() : number {
        return this.control.snappedBottomInset();
    }

    snappedLeftInset() : number {
        return this.control.snappedLeftInset();
    }

    snapSpace(value : number) : number {
        return this.control.isSnapToPixel() ? Math.round(value) : value;
    }

    snapSize(value : number) : number {
        return this.control.isSnapToPixel() ? Math.ceil(value) : value;
    }

    snapPosition(value : number) : number {
        return this.control.isSnapToPixel() ? Math.round(value) : value;
    }

    positionInArea(child : Node, areaX : number, areaY : number, areaWidth : number, areaHeight : number,
                   areaBaselineOffset : number, insets : Insets, halignment : HPos, valignment : VPos) {
        Region.positionInArea(child, areaX, areaY, areaWidth, areaHeight, areaBaselineOffset, insets, halignment, valignment, this.control.isSnapToPixel());
    }

    layoutInArea(child : Node, areaX : number, areaY : number, areaWidth : number, areaHeight : number,
                 areaBaselineOffset : number, insets : Insets, fillWidth : boolean, fillHeight : boolean,
                 halignment : HPos, valignment : VPos) {
        Region.layoutInArea(child, areaX, areaY, areaWidth, areaHeight, areaBaselineOffset, insets, fillWidth, fillHeight, halignment, valignment, this.control.isSnapToPixel());
    }
}