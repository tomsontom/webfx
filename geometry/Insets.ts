export class Insets {
    public static readonly EMPTY : Insets = new Insets(0, 0, 0, 0);

    top    : number;
    right  : number;
    bottom : number;
    left   : number;


    constructor(top : number, right : number, bottom : number, left : number) {
        this.top    = top;
        this.right  = right;
        this.bottom = bottom;
        this.left   = left;
    }
}