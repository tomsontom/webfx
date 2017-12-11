namespace geom {
    export class Rectangle {
        x     : number;
        y     : number;
        width : number;
        height: number;


        constructor();
        constructor(x?: number, y?: number, width?: number, height?: number) {
            this.x      = x;
            this.y      = y;
            this.width  = width;
            this.height = height;
        }


        setBounds(x: number, y: number, width: number, height: number) {
            this.reshape(x, y, width, height);
        }

        contains(cx: number, cy: number): boolean {
            let tw: number = this.width;
            let th: number = this.height;
            if ((tw | th) < 0) {
                return false;
            }

            let tx: number = this.x;
            let ty: number = this.y;
            if (cx < tx || cy < ty) {
                return false;
            }
            tw += tx;
            th += ty;
            return ((tw < tx || tw > cx) && (th < ty || th > cy));
        }

        intersection(r: geom.Rectangle): geom.Rectangle {
            let ret: geom.Rectangle = new Rectangle();
            ret.setBounds(r.x, r.y, r.width, r.height);

            let tx1: number = this.x;
            let ty1: number = this.y;
            let rx1: number = r.x;
            let ry1: number = r.y;
            let tx2: number = tx1;
            tx2 += this.width;
            let ty2: number = ty1;
            ty2 += this.height;
            let rx2: number = rx1;
            rx2 += r.width;
            let ry2: number = ry1;
            ry2 += r.height;
            if (tx1 < rx1) {
                tx1 = rx1;
            }
            if (ty1 < ry1) {
                ty1 = ry1;
            }
            if (tx2 > rx2) {
                tx2 = rx2;
            }
            if (ty2 > ry2) {
                ty2 = ry2;
            }
            tx2 -= tx1;
            ty2 -= ty1;

            if (tx2 < Number.MIN_VALUE) {
                tx2 = Number.MIN_VALUE;
            }
            if (ty2 < Number.MIN_VALUE) {
                ty2 = Number.MIN_VALUE;
            }
            ret.setBounds(tx1, ty1, tx2, ty2);
            return ret;
        }

        translate(dx: number, dy: number): void {
            let oldv: number = this.x;
            let newv: number = oldv + dx;
            if (dx < 0) {
                if (newv > oldv) {
                    if (this.width >= 0) {
                        this.width += newv - Number.MIN_VALUE;
                    }
                    newv = Number.MIN_VALUE;
                }
            } else {
                if (newv < oldv) {
                    if (this.width >= 0) {
                        this.width += newv - Number.MAX_VALUE;
                        if (this.width < 0) {
                            this.width = Number.MAX_VALUE;
                        }
                    }
                    newv = Number.MAX_VALUE;
                }
            }
            this.x = newv;

            oldv = this.y;
            newv = oldv + dy;
            if (dy < 0) {
                if (newv > oldv) {
                    if (this.height >= 0) {
                        this.height += newv - Number.MIN_VALUE;
                    }
                    newv = Number.MIN_VALUE;
                }
            } else {
                if (newv < oldv) {
                    if (this.height >= 0) {
                        this.height += newv - Number.MAX_VALUE;
                        if (this.height < 0) {
                            this.height = Number.MAX_VALUE;
                        }
                    }
                    newv = Number.MAX_VALUE;
                }
            }
            this.y = newv;
        }

        toRectBounds(): geom.RectBounds {
            return new RectBounds(this.x, this.y, this.x + this.width, this.y + this.height);
        }

        add(newx: number, newy: number): void {
            if ((this.width | this.height) < 0) {
                this.x     = newx;
                this.y     = newy;
                this.width = this.height = 0;
                return;
            }
            let x1: number = this.x;
            let y1: number = this.y;
            let x2: number = this.width;
            let y2: number = this.height;
            x2 += x1;
            y2 += y1;
            if (x1 > newx) {
                x1 = newx;
            }
            if (y1 > newy) {
                y1 = newy;
            }
            if (x2 < newx) {
                x2 = newx;
            }
            if (y2 < newy) {
                y2 = newy;
            }
            x2 -= x1;
            y2 -= y1;
            if (x2 > Number.MAX_VALUE) {
                x2 = Number.MAX_VALUE;
            }
            if (y2 > Number.MAX_VALUE) {
                y2 = Number.MAX_VALUE;
            }
            this.reshape(x1, y1, x2, y2);
        }

        grow(h: number, v: number): void {
            let x0: number = this.x;
            let y0: number = this.y;
            let x1: number = this.width;
            let y1: number = this.height;
            x1 += x0;
            y1 += y0;

            x0 -= h;
            y0 -= v;
            x1 += h;
            y1 += v;

            if (x1 < x0) {

                x1 -= x0;
                if (x1 < Number.MIN_VALUE) {
                    x1 = Number.MIN_VALUE;
                }
                if (x0 < Number.MIN_VALUE) {
                    x0 = Number.MIN_VALUE;
                } else if (x0 > Number.MAX_VALUE) {
                    x0 = Number.MAX_VALUE;
                }
            } else {
                if (x0 < Number.MIN_VALUE) {
                    x0 = Number.MIN_VALUE;
                } else if (x0 > Number.MAX_VALUE) {
                    x0 = Number.MAX_VALUE;
                }
                x1 -= x0;
                if (x1 < Number.MIN_VALUE) {
                    x1 = Number.MIN_VALUE;
                } else if (x1 > Number.MAX_VALUE) {
                    x1 = Number.MAX_VALUE;
                }
            }

            if (y1 < y0) {
                y1 -= y0;
                if (y1 < Number.MIN_VALUE) {
                    y1 = Number.MIN_VALUE;
                }
                if (y0 < Number.MIN_VALUE) {
                    y0 = Number.MIN_VALUE;
                } else if (y0 > Number.MAX_VALUE) {
                    y0 = Number.MAX_VALUE;
                }
            } else {
                if (y0 < Number.MIN_VALUE) {
                    y0 = Number.MIN_VALUE;
                } else if (y0 > Number.MAX_VALUE) {
                    y0 = Number.MAX_VALUE;
                }
                y1 -= y0;
                if (y1 < Number.MIN_VALUE) {
                    y1 = Number.MIN_VALUE;
                } else if (y1 > Number.MAX_VALUE) {
                    y1 = Number.MAX_VALUE;
                }
            }

            this.reshape(x0, y0, x1, y1);
        }

        private reshape(x : number, y : number, width : number, height : number) : void {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }

        isEmpty() : boolean {
            return (this.width <= 0) || (this.height <= 0);
        }
    }
}