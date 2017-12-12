import { Paint } from "./../paint/Paint";
import { CornerRadii } from "./../layout/CornerRadii";
import { Insets } from "./../../geometry/Insets";

export class BackgroundFill {
    paint       : Paint;
    cornerRadii : CornerRadii;
    insets      : Insets;


    constructor(paint : Paint, cornerRadii: CornerRadii, insets : Insets) {
        this.paint       = paint;
        this.cornerRadii = cornerRadii;
        this.insets      = insets;
    }
}