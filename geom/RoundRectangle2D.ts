namespace geom {
    export class RoundRectangle2D {
        x         : number;
        y         : number;
        width     : number;
        height    : number;
        arcWidth  : number;
        arcHeight : number;


        //constructor();
        constructor(x : number, y : number, w : number, h : number, arcw : number, arch : number) {
            this.setRoundRect(x, y, w, h, arcw, arch);
        }



        isEmpty() : boolean {
            return (this.width <= 0.0) || (this.height <= 0.0);
        }

        setRoundRect(x : number, y : number, w : number, h : number, arcw : number, arch : number) {
            this.x         = x;
            this.y         = y;
            this.width     = w;
            this.height    = h;
            this.arcWidth  = arcw;
            this.arcHeight = arch;
        }

        setRoundRect(rr : RoundRectangle2D) : void {
            this.setRoundRect(rr.x, rr.y, rr.width, rr.height, rr.arcWidth, rr.arcHeight);
        }
    
        getBounds() : geom.RectBounds {
            return new RectBounds(this.x, this.y, this.x + this.width, this.y + this.height);
        }


        setFrame(x : number, y : number, w : number, h : number) : void {
            this.setRoundRect(x, y, w, h, this.arcWidth, this.arcHeight);
        }

        contains(x : number, y : number) {
            if (this.isEmpty()) { return false; }
            let rrx0 : number = this.x;
            let rry0 : number = this.y;
            let rrx1 : number = rrx0 + this.width;
            let rry1 : number = rry0 + this.height;

            if (x < rrx0 || y < rry0 || x >= rrx1 || y >= rry1) {
                return false;
            }
            let aw : number = Math.min(this.width, Math.abs(this.arcWidth)) / 2;
            let ah : number = Math.min(this.height, Math.abs(this.arcHeight)) / 2;

            if (x >= (rrx0 += aw) && x < (rrx0 = rrx1 - aw)) {
                return true;
            }
            if (y >= (rry0 += ah) && y < (rry0 = rry1 - ah)) {
                return true;
            }
            x = (x - rrx0) / aw;
            y = (y - rry0) / ah;
            return (x * x + y * y <= 1.0);
        }

        contains(x : number, y : number, w : number, h : number) : boolean {
            if (this.isEmpty() || w <= 0 || h <= 0) {
                return false;
            }
            return (this.contains(x, y) && this.contains(x + w, y) && this.contains(x, y + h) && this.contains(x + w, y + h));
        }

        classify(coord : number, left : number, right : number, arcsize : number) : number {
            if (coord < left) {
                return 0;
            } else if (coord < left + arcsize) {
                return 1;
            } else if (coord < right - arcsize) {
                return 2;
            } else if (coord < right) {
                return 3;
            } else {
                return 4;
            }
        }

        intersects(x : number, y : number, w : number, h : number) : boolean {
            if (this.isEmpty() || w <= 0 || h <= 0) {
                return false;
            }
            let rrx0 : number= this.x;
            let rry0 : number = this.y;
            let rrx1 : number = rrx0 + this.width;
            let rry1 : number = rry0 + this.height;
            if (x + w <= rrx0 || x >= rrx1 || y + h <= rry0 || y >= rry1) {
                return false;
            }
            let aw      : number = Math.min(this.width, Math.abs(this.arcWidth)) / 2;
            let ah      : number = Math.min(this.height, Math.abs(this.arcHeight)) / 2;
            let x0class : number = this.classify(x, rrx0, rrx1, aw);
            let x1class : number = this.classify(x + w, rrx0, rrx1, aw);
            let y0class : number = this.classify(y, rry0, rry1, ah);
            let y1class : number = this.classify(y + h, rry0, rry1, ah);
            if (x0class == 2 || x1class == 2 || y0class == 2 || y1class == 2) {
                return true;
            }
            if ((x0class < 2 && x1class > 2) || (y0class < 2 && y1class > 2)) {
                return true;
            }
            x = (x1class == 1) ? (x = x + w - (rrx0 + aw)) : (x = x - (rrx1 - aw));
            y = (y1class == 1) ? (y = y + h - (rry0 + ah)) : (y = y - (rry1 - ah));
            x = x / aw;
            y = y / ah;
            return (x * x + y * y <= 1);
        }

        getPathIterator(tx : geom.transform.BaseTransform) : geom.PathIterator {
            return new RoundRectIterator(this, tx);
        }

        copy() : RoundRectangle2D{
            return new RoundRectangle2D(this.x, this.y, this.width, this.height, this.arcWidth, this.arcHeight);
        }
    }
}