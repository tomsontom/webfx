import {Skin} from "./Skin";
import {Skinnable} from "./Skinnable";
import {Node} from "./../Node";


export class PopupControl<C extends Skinnable> {
    public static readonly USE_PREF_SIZE     : number = Number.NEGATIVE_INFINITY;
    public static readonly USE_COMPUTED_SIZE : number = -1;

    skin       : Skin<C>;
    minWidth   : number;
    minHeight  : number;
    prefWidth  : number;
    prefHeight : number;
    maxWidth   : number;
    maxHeight  : number;


    constructor() {

    }


    getSkinNode() : Node {
        return null == this.skin ? null : this.skin.getNode();
    }

    setMinSize(minWidth: number, minHeight : number) {
        this.minWidth  = minWidth;
        this.minHeight = minHeight;
    }

    setPrefSize(prefWidth : number, prefHeight : number) {
        this.prefWidth  = prefWidth;
        this.prefHeight = prefHeight;
    }

    setMaxSize(maxWidth : number, maxHeight : number) {
        this.maxWidth  = maxWidth;
        this.maxHeight = maxHeight;
    }

    private recalculateMinWidth(height : number) : number {
        this.recomputeSkinSize();
        return this.getSkinNode() == null ? 0 : this.getSkinNode().minWidth(height);
    }

    private recalculateMinHeight(width : number) : number {
        this.recomputeSkinSize();
        return this.getSkinNode() == null ? 0 : this.getSkinNode().minHeight(width);
    }

    private recalculateMaxWidth(height : number) : number {
        this.recomputeSkinSize();
        return this.getSkinNode() == null ? 0 : this.getSkinNode().maxWidth(height);
    }

    private recalculateMaxHeight(width : number) : number {
        this.recomputeSkinSize();
        return this.getSkinNode() == null ? 0 : this.getSkinNode().maxHeight(width);
    }

    private recalculatePrefWidth(height : number) : number {
        this.recomputeSkinSize();
        return this.getSkinNode() == null? 0 : this.getSkinNode().prefWidth(height);
    }

    private recalculatePrefHeight(width : number) : number {
        this.recomputeSkinSize();
        return this.getSkinNode() == null? 0 : this.getSkinNode().prefHeight(width);
    }

    private recomputeSkinSize() : void {

    }
}