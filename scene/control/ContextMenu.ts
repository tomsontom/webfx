import {Node} from "../Node";
import {Side} from "../../geometry/Side";
import {HPos} from "../../geometry/HPos";
import {VPos} from "../../geometry/VPos";
import {Point2D} from "../../geometry/Point2D";
import {Utils} from "../../util/Utils";

export class ContextMenu extends PopupControl {
    items : MenuItem;
    autoHide : boolean;




    show(anchor : Node, side : Side, dx : number, dy : number) : void{
        let hpos : HPos = side == Side.LEFT ? HPos.LEFT : side == Side.RIGHT ? HPos.RIGHT : HPos.CENTER;
        let vpos : VPos = side == Side.TOP ? VPos.TOP : side == Side.BOTTOM ? VPos.BOTTOM : VPos.CENTER;

        let point : Point2D = Utils.pointRelativeTo(anchor, prefWidth(-1), prefHeight(-1), hpos, vpos, dx, dy, true);
        this.doShow(anchor, point.x, point.y);
    }

    private doShow(anchor : Node, screenX : number, screenY : number) : void {

    }

    hide() : void {

    }
}