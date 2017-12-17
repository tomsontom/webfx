import { TShape } from "./BasicShapes";

export class TSVGPath extends TShape {
    constructor() {
        super("path");
    }

    get d() {
        return this.get("d");
    }

    set d(d: string) {
        this.set("d",d);
    }
}