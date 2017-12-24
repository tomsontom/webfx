import {NGNode, Node} from "./Node";
import {Parent} from "./Parent";
import {NodeOrientation} from "../geometry/NodeOrientation";

enum SubSceneDirtyBits {
    SIZE_DIRTY,
    FILL_DIRTY,
    ROOT_SG_DIRTY,
    CAMERA_DIRTY,
    LIGHTS_DIRTY,
    CONTENT_DIRTY
}

export class SubScene extends Node {
    private root   : Parent;
    private width  : number;
    private height : number;


    getRoot() : Parent {
        return this.root;
    }
    setRoot(root : Parent) : void {
        this.root = root;
    }

    markContentDirty() : void {
        this.markDirty(SubSceneDirtyBits.CONTENT_DIRTY);
    }

    getWidth() : number {
        return this.width;
    }
    setWidth(width : number) : void {
        var _root : Parent = this.getRoot();

        //if (_root.getEffectiveNodeOrientation() == NodeOrientation.RIGHT_TO_LEFT) {
        //    _root.impl_transformsChanged();
        // }
        if (_root.isResizable()) {
            _root.resize(this.width - _root.getLayoutX() - _root.getTranslateX(), _root.getLayoutBounds().height);
        }
        this.markDirty(SubSceneDirtyBits.SIZE_DIRTY);
        //SubScene.this.impl_geomChanged();
    }


    getNgNode(): NGNode {
        return undefined;
    }
}