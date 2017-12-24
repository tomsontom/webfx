import {ContextMenu} from "./ContextMenu";
import {Node} from "../Node";
import {Skinnable} from "./Skinnable";

export class MenuItem<C extends Skinnable> {
    visible     : boolean;
    disable     : boolean;
    text        : string;
    parentPopup : ContextMenu<C>;
    userData    : any;
    graphic     : Node;


    constructor();
    constructor(text : string);
    constructor(text : string, graphic : Node);
    constructor(text? : string, graphic? : Node) {
        this.text    = text;
        this.graphic = graphic;
    }
}