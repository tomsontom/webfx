import {Parent} from "./Parent";
import {Bounds} from "../geometry/Bounds";
import {Orientation} from "../geometry/Orientation";
import {LayoutFlags} from "./LayoutFlags";
import {Point3D} from "../geometry/Point3D";

class NodeTransformation {
    public static readonly DEFAULT_TRANSLATE_X   : number = 0;
    public static readonly DEFAULT_TRANSLATE_Y   : number = 0;
    public static readonly DEFAULT_TRANSLATE_Z   : number = 0;
    public static readonly DEFAULT_SCALE_X       : number = 1;
    public static readonly DEFAULT_SCALE_Y       : number = 1;
    public static readonly DEFAULT_SCALE_Z       : number = 1;
    public static readonly DEFAULT_ROTATE        : number = 0;
    public static readonly DEFAULT_ROTATION_AXIS : Point3D = Rotate.Z_AXIS;

    translateX   : number;
    translateY   : number;
    translateZ   : number;
    scaleX       : number;
    scaleY       : number;
    scaleZ       : number;
    rotate       : number;
    rotationAxis : Point3D;


}

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
    private parent         : Parent;
    protected scene        : any; //Scene;
    protected subScene     : any; //SubScene;


    constructor() {
        console.log("Node");
    }


    getLayoutX() : number {
        return this.layoutX;
    }
    setLayoutX(layoutX : number) : void {
        this.layoutX = layoutX;
        let p : Parent = this.parent;
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
        let p : Parent = this.parent;
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

    getContentBias() : Orientation {
        return null;
    }

    minWidth(height : number) : number {
        return this.prefWidth(height);
    }

    minHeight(width : number) : number {
        return this.prefHeight(width);
    }

    prefWidth(height : number) : number {
        let result : number = this.getLayoutBounds().width;
        return Number.isNaN(result) || result < 0 ? 0 : result;
    }

    prefHeight(width : number) : number {
        let result = this.getLayoutBounds().height;
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

    autosize() : void {
        if (this.isResizable()) {
            var contentBias : Orientation = this.getContentBias();
            var w : number;
            var h : number;
            if (contentBias == null) {
                w = this.boundedSize(this.prefWidth(-1), this.minWidth(-1), this.maxWidth(-1));
                h = this.boundedSize(this.prefHeight(-1), this.minHeight(-1), this.maxHeight(-1));
            } else if (contentBias == Orientation.HORIZONTAL) {
                w = this.boundedSize(this.prefWidth(-1), this.minWidth(-1), this.maxWidth(-1));
                h = this.boundedSize(this.prefHeight(w), this.minHeight(w), this.maxHeight(w));
            } else { // bias == VERTICAL
                h = this.boundedSize(this.prefHeight(-1), this.minHeight(-1), this.maxHeight(-1));
                w = this.boundedSize(this.prefWidth(h), this.minWidth(h), this.maxWidth(h));
            }
            this.resize(w,h);
        }
    }

    boundedSize(value : number, min : number, max : number) : number {
        return Math.min(Math.max(value, min), Math.max(min, max));
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

    getParent() : Parent {
        return this.parent;
    }

    markDirtyLayoutBranch() : void{
        var p : Parent = this.getParent();
        while (p != null && p.layoutFlag == LayoutFlags.CLEAN) {
            p.setLayoutFlag(LayoutFlags.DIRTY_BRANCH);
            if (p.sceneRoot) {
                //Toolkit.getToolkit().requestNextPulse();
                if (this.subScene() != null) {
                    this.subScene().setDirtyLayout(p);
                }
            }
            p = p.getParent();
        }
    }

    abstract getNgNode() : NGNode;
}