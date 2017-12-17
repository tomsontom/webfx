import {Parent} from "./Parent";
import {Bounds} from "../geometry/Bounds";

export interface NGNode {
    sync();
}
export abstract class Node {
    public static readonly BASELINE_OFFSET_SAME_AS_HEIGHT = Number.NEGATIVE_INFINITY;

    private layoutX        : number;
    private layoutY        : number;
    private managed        : boolean;
    private boundsInParent : Bounds;
    private boundsInLocal  : Bounds;
    private layoutBounds   : Bounds;


    constructor() {
        console.log("Node");
    }


    getLayoutX() : number {
        return this.layoutX;
    }
    setLayoutX(layoutX : number) : void {
        this.layoutX = layoutX;
        let p : Parent = this.getParent();
        if (p != null && !p.performingLayout) {
            if (this.isManaged()) {
                p.requestLayout();
            } else {
                p.clearSizeCache();
                p.requestParentLayout();
            }
        }
    }

    getLayoutY() : number {
        return this.layoutY;
    }
    setLayoutY(layoutY : number) : void {
        this.layoutY = layoutY;
        let p : Parent = this.getParent();
        if (p != null && !p.performingLayout) {
            if (this.isManaged()) {
                p.requestLayout();
            } else {
                p.clearSizeCache();
                p.requestParentLayout();
            }
        }
    }

    isManaged() : boolean {
        return this.managed == null ? true : this.managed;
    }
    setManaged(managed : boolean) : void {
        this.managed = managed;
        this.notifyManagedChanged();
    }

    notifyManagedChanged() : void { }

    isResizable() {
        return false;
    }

    minWidth(height : number) : number {
        return this.prefWidth(height);
    }

    minHeight(width : number) : number {
        return this.prefHeight(width);
    }

    prefWidth(height : number) : number {
        let result : number = this.getLayoutBounds().getWidth();
        return Number.isNaN(result) || result < 0 ? 0 : result;
    }

    prefHeight(width : number) : number {
        let result = this.getLayoutBounds().getHeight();
        return Number.isNaN(result) || result < 0 ? 0 : result;
    }

    maxWidth(height : number) : number {
        return this.prefWidth(height);
    }

    maxHeight(width : number) : number {
        return this.prefHeight(width);
    }

    resize(width: number, height: number) {
        this.getNgNode().sync();
    }

    relocate(x: number, y: number) {
        this.layoutX = x;
        this.layoutY = y;
        this.getNgNode().sync();
    }

    resizeRelocate(x: number, y: number, width: number, height: number) {
        this.relocate(x,y);
        this.resize(width,height);
        this.getNgNode().sync();
    }

    getBaselineOffset() : number {
        if (this.isResizable()) {
            return Node.BASELINE_OFFSET_SAME_AS_HEIGHT;
        } else {
            return this.layoutBounds.height;
        }
    }

    getBoundsInParent() : Bounds {
        return this.boundsInParent;
    }

    getBoundsInLocal() : Bounds {
        return this.boundsInLocal;
    }

    getLayoutBounds() : Bounds {
        return this.layoutBounds;
    }

    abstract getNgNode() : NGNode;
}