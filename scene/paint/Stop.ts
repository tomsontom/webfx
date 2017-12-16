import { Color } from "./Color";

export class Stop {
    static readonly NO_STOPS: Stop[] = [new Stop(0.0, Color.TRANSPARENT), new Stop(1.0, Color.TRANSPARENT)];

    offset: number;
    color: Color;

    constructor();
    constructor(offset: number, color: Color);
    constructor(offset?: number, color?: Color) {
        this.color  = color;
        this.offset = offset;
    }


    static normalize(stops: Stop[]): Stop[] {
        if (stops == null) {
            return this.NO_STOPS;
        }
        let zerostop: Stop  = null;
        let onestop: Stop   = null;
        let newlist: Stop[] = [];

        for (let i: number = 0; i < stops.length; i++) {
            let s: Stop = stops[i];
            if (s == null || s.color == null) {
                continue;
            }
            let off: number = s.offset;
            if (off <= 0.0) {
                if (zerostop == null || off >= zerostop.offset) {
                    zerostop = s;
                }
            } else if (off >= 1.0) {
                if (onestop == null || off < onestop.offset) {
                    onestop = s;
                }
            } else if (off == off) { // non-NaN
                for (let i: number = newlist.length - 1; i >= 0; i--) {
                    let s2: Stop = newlist[i];
                    if (s2.offset <= off) {
                        if (s2.offset == off) {
                            if (i > 0 && newlist[i - 1].offset == off) {
                                newlist[i] = s;
                            } else {
                                newlist.push(s);
                            }
                        } else {
                            newlist.push(s);
                        }
                        s = null;
                        break;
                    }
                }
                if (s != null) {
                    newlist.unshift(s); // add at beginning of array
                }
            }
        }

        if (zerostop == null) {
            let zerocolor: Color;
            if (newlist.length == 0) {
                if (onestop == null) {
                    return this.NO_STOPS;
                }
                zerocolor = onestop.color;
            } else {
                zerocolor = newlist[0].color;
                if (onestop == null && newlist.length == 1) {
                    newlist.length = 0;
                }
            }
            zerostop = new Stop(0.0, zerocolor);
        } else if (zerostop.offset < 0.0) {
            zerostop = new Stop(0.0, zerostop.color);
        }
        newlist.unshift(zerostop); // add at beginning of array

        if (onestop == null) {
            onestop = new Stop(1.0, newlist[(newlist.length - 1)].color);
        } else if (onestop.offset > 1.0) {
            onestop = new Stop(1.0, onestop.color);
        }
        newlist.push(onestop);

        return newlist.slice();
    }
}