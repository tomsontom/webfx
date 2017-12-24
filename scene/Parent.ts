import { NGNode, Node } from "./Node";
import {LayoutFlags} from "./LayoutFlags";

export interface NGParent extends NGNode {
    
}

export abstract class Parent extends Node {
    static readonly         DIRTY_CHILDREN_THRESHOLD    : number = 10;
    private static readonly REMVOVED_CHILDREN_THRESHOLD : number = 20;

    children         : Node[];
    needsLayout      : boolean;
    layoutFlag       : LayoutFlags;
    performingLayout : boolean;
    sceneRoot        : boolean;
    layoutRoot       : boolean;
    sizeCacheClear   : boolean;
    prefWidthCache   : number;
    prefHeightCache  : number;
    minWidthCache    : number;
    minHeightCache   : number;


    constructor() {
        super();
        console.log("Parent");
        this.children        = [];
        this.needsLayout     = false;
        this.layoutFlag      = LayoutFlags.CLEAN;
        this.sceneRoot       = false;
        this.layoutRoot      = false;
        this.sizeCacheClear  = false;
        this.prefWidthCache  = -1;
        this.prefHeightCache = -1;
        this.minWidthCache   = -1;
        this.minHeightCache  = -1;
    }


    isNeedsLayout() : boolean {
        return this.layoutFlag == LayoutFlags.NEEDS_LAYOUT;
    }
    setNeedsLayout(value : boolean) {
        if (value) {
            this.markDirtyLayout(true);
        } else {
            var hasBranch = false;
            for (var i : number = 0 ; i < this.children.length ; i++) {
                var child : Node = this.children[i];
                if (child instanceof Parent) {
                    if ((<Parent> child).layoutFlag != LayoutFlags.CLEAN) {
                        hasBranch = true;
                        break;
                    }
                }
            }
            this.setLayoutFlag(hasBranch ? LayoutFlags.DIRTY_BRANCH : LayoutFlags.CLEAN);
        }
    }

    setLayoutFlag(flag : LayoutFlags) : void {
        this.needsLayout = flag == LayoutFlags.NEEDS_LAYOUT;
        this.layoutFlag  = flag;
    }

    private markDirtyLayout(local : boolean) : void {
        this.setLayoutFlag(LayoutFlags.NEEDS_LAYOUT);
        if (local || this.layoutRoot) {
            if (this.sceneRoot) {
                //Toolkit.getToolkit().requestNextPulse();
                if (this.subScene != null) {
                    this.subScene.setDirtyLayout(this);
                }
            } else {
                this.markDirtyLayoutBranch();
            }
        } else {
            this.requestParentLayout();
        }
    }

    requestLayout() : void {
        this.markDirtyLayout(false);
    }

    requestParentLayout() : void {
        if (!this.layoutRoot) {
            var parent = this.getParent();
            if (parent != null && !parent.performingLayout) {
                parent.requestLayout();
            }
        }
    }

    clearSizeCache() : void {
        if (this.sizeCacheClear) { return; }
        this.sizeCacheClear  = true;
        this.prefWidthCache  = -1;
        this.prefHeightCache = -1;
        this.minWidthCache   = -1;
        this.minHeightCache  = -1;
    }

    prefWidth(height : number) : number {
        if (height == -1) {
            if (this.prefWidthCache == -1) {
                this.prefWidthCache = this.computePrefWidth(-1);
                if (Number.isNaN(this.prefWidthCache) || this.prefWidthCache < 0) this.prefWidthCache = 0;
                this.sizeCacheClear = false;
            }
            return this.prefWidthCache;
        } else {
            var result : number = this.computePrefWidth(height);
            return Number.isNaN(result) || result < 0 ? 0 : result;
        }
    }

    prefHeight(width : number) : number {
        if (width == -1) {
            if (this.prefHeightCache == -1) {
                this.prefHeightCache = this.computePrefHeight(-1);
                if (Number.isNaN(this.prefHeightCache) || this.prefHeightCache < 0) this.prefHeightCache = 0;
                this.sizeCacheClear = false;
            }
            return this.prefHeightCache;
        } else {
            var result :number = this.computePrefHeight(width);
            return Number.isNaN(result) || result < 0 ? 0 : result;
        }
    }

    minWidth(height : number) : number {
        if (height == -1) {
            if (this.minWidthCache == -1) {
                this.minWidthCache = this.computeMinWidth(-1);
                if (Number.isNaN(this.minWidthCache) || this.minWidthCache < 0) this.minWidthCache = 0;
                this.sizeCacheClear = false;
            }
            return this.minWidthCache;
        } else {
            var result : number = this.computeMinWidth(height);
            return Number.isNaN(result) || result < 0 ? 0 : result;
        }
    }

    minHeight(width : number) : number {
        if (width == -1) {
            if (this.minHeightCache == -1) {
                this.minHeightCache = this.computeMinHeight(-1);
                if (Number.isNaN(this.minHeightCache) || this.minHeightCache < 0) this.minHeightCache = 0;
                this.sizeCacheClear = false;
            }
            return this.minHeightCache;
        } else {
            var result : number = this.computeMinHeight(width);
            return Number.isNaN(result) || result < 0 ? 0 : result;
        }
    }

    protected computePrefWidth(height : number) : number {
        var minX : number = 0;
        var maxX : number = 0;
        for (var i : number = 0 ; i < this.children.length ; i++) {
            var node : Node = this.children[i];
            if (node.isManaged()) {
                var x = node.getLayoutBounds().minX + node.getLayoutX();
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x + this.boundedSize(node.prefWidth(-1), node.minWidth(-1), node.maxWidth(-1)));
            }
        }
        return maxX - minX;
    }

    protected computePrefHeight(width : number) : number {
        var minY : number = 0;
        var maxY : number = 0;
        for (var i : number = 0 ; i < this.children.length ; i++) {
            var node : Node = this.children[i];
            if (node.isManaged()) {
                var y = node.getLayoutBounds().minY + node.getLayoutY();
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y + this.boundedSize(node.prefHeight(-1), node.minHeight(-1), node.maxHeight(-1)));
            }
        }
        return maxY - minY;
    }

    protected computeMinWidth(height : number) : number {
        return this.prefWidth(height);
    }

    protected computeMinHeight(width : number) : number {
        return this.prefHeight(width);
    }

    getBaseLineOffset() : number {
        for (var i : number =0; i < this.children.length; i++) {
            var child = this.children[i];
            if (child.isManaged()) {
                var offset : number = child.getBaselineOffset();
                if (offset == Node.BASELINE_OFFSET_SAME_AS_HEIGHT) {
                    continue;
                }
                return child.getLayoutBounds().minY + child.getLayoutY() + offset;
            }
        }
        return super.getBaselineOffset();
    }

    layout() : void {
        switch(this.layoutFlag) {
            case LayoutFlags.CLEAN:
                break;
            case LayoutFlags.NEEDS_LAYOUT:
                if (this.performingLayout) {

                }
                this.performingLayout = true;
                this.layoutChildren();
                // Intended fall-through
            case LayoutFlags.DIRTY_BRANCH:
                for (var i : number = 0 ; i < this.children.length ; i++) {
                var child = this.children[i];
                if (child instanceof Parent) {
                    (<Parent>child).layout();
                    } else if (child instanceof SubScene) {
                        (<SubScene>child).layoutPass();
                    }
                }
                this.setLayoutFlag(LayoutFlags.CLEAN);
                this.performingLayout = false;
                break;
        }
    }

    protected layoutChildren() : void {
        for (var i : number = 0 ; this.children.length; i++) {
            var node = this.children[i];
            if (node.isResizable() && node.isManaged()) {
                node.autosize();
            }
        }
    }

    notifiyManagedChanged() : void {
        this.layoutRoot = !this.isManaged() || this.sceneRoot;
    }



}