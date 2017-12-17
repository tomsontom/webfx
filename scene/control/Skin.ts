import {Skinnable} from "./Skinnable";
import {Node} from "./../Node";

export interface Skin<C extends Skinnable> {
    getSkinnable() : C;

    getNode() : Node;

    dispose();
}