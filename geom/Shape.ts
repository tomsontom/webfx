namespace geom {

    export abstract class Shape {

        static readonly RECT_INTERSECTS : number = 0x80000000;
        static readonly OUT_LEFT        : number = 1;
        static readonly OUT_TOP         : number = 2;
        static readonly OUT_RIGHT       : number = 4;
        static readonly OUT_BOTTOM      : number = 8;


        abstract getBounds(): geom.RectBounds;

        abstract intersects(x: number, y: number, w: number, h: number) : boolean;

        intersects(r: geom.RectBounds): boolean {
            let x: number = r.getMinX();
            let y: number = r.getMinY();
            let w: number = r.getMaxX() - x;
            let h: number = r.getMaxY() - y;
            return this.intersects(x, y, w, h);
        }

        abstract contains(x: number, y: number, w: number, h: number) : boolean;

        abstract contains(x: number, y: number): boolean;

        contains(p: geom.Point2D): boolean {
            return contains(p.x, p.y);
        }

        contains(r: geom.RectBounds): boolean {
            let x: number = r.getMinX();
            let y: number = r.getMinY();
            let w: number = r.getMaxX() - x;
            let h: number = r.getMaxY() - y;
            return this.contains(x, y, w, h);
        }

        abstract getPathIterator(tx: geom.transform.BaseTransform): geom.PathIterator;

        abstract getPathIterator(tx: geom.transform.BaseTransform, flatness: number): geom.PathIterator;

        abstract copy(): geom.Shape;

        static pointCrossingsForPath(pi: PathIterator, px: number, py: number): number {
            if (pi.isDone()) {
                return 0;
            }
            let coords: number[] = [];
            if (pi.currentSegment(coords) != geom.SegmentType.MOVE_TO) {
                throw new SyntaxError("missing initial moveto in path definition");
            }
            pi.next();
            let movx: number      = coords[0];
            let movy: number      = coords[1];
            let curx: number      = movx;
            let cury: number      = movy;
            let endx: number;
            let endy: number;
            let crossings: number = 0;
            while (!pi.isDone()) {
                switch (pi.currentSegment(coords)) {
                    case geom.SegmentType.MOVE_TO:
                        if (cury != movy) {
                            crossings += this.pointCrossingsForLine(px, py, curx, cury, movx, movy);
                        }
                        movx = curx = coords[0];
                        movy = cury = coords[1];
                        break;
                    case geom.SegmentType.LINE_TO:
                        endx = coords[0];
                        endy = coords[1];
                        crossings += this.pointCrossingsForLine(px, py, curx, cury, endx, endy);
                        curx = endx;
                        cury = endy;
                        break;
                    case geom.SegmentType.QUAD_TO:
                        endx = coords[2];
                        endy = coords[3];
                        crossings += this.pointCrossingsForQuad(px, py, curx, cury, coords[0], coords[1], endx, endy, 0);
                        curx = endx;
                        cury = endy;
                        break;
                    case geom.SegmentType.CURVE_TO:
                        endx = coords[4];
                        endy = coords[5];
                        crossings += this.pointCrossingsForCubic(px, py, curx, cury, coords[0], coords[1], coords[2], coords[3], endx, endy, 0);
                        curx = endx;
                        cury = endy;
                        break;
                    case geom.SegmentType.CLOSE:
                        if (cury != movy) {
                            crossings += this.pointCrossingsForLine(px, py, curx, cury, movx, movy);
                        }
                        curx = movx;
                        cury = movy;
                        break;
                }
                pi.next();
            }
            if (cury != movy) {
                crossings += this.pointCrossingsForLine(px, py, curx, cury, movx, movy);
            }
            return crossings;
        }


        static pointCrossingsForLine(px: number, py: number, x0: number, y0: number, x1: number, y1: number): number {
            if (py < y0 && py < y1) {
                return 0;
            }
            if (py >= y0 && py >= y1) {
                return 0;
            }
            // assert(y0 != y1);
            if (px >= x0 && px >= x1) {
                return 0;
            }
            if (px < x0 && px < x1) {
                return (y0 < y1) ? 1 : -1;
            }
            let xintercept: number = x0 + (py - y0) * (x1 - x0) / (y1 - y0);
            if (px >= xintercept) {
                return 0;
            }
            return (y0 < y1) ? 1 : -1;
        }

        static pointCrossingsForQuad(px: number, py: number, x0: number, y0: number, xc: number, yc: number, x1: number,
                                     y1: number, level: number): number {
            if (py < y0 && py < yc && py < y1) {
                return 0;
            }
            if (py >= y0 && py >= yc && py >= y1) {
                return 0;
            }
            if (px >= x0 && px >= xc && px >= x1) {
                return 0;
            }
            if (px < x0 && px < xc && px < x1) {
                if (py >= y0) {
                    if (py < y1) {
                        return 1;
                    }
                } else {
                    if (py >= y1) {
                        return -1;
                    }
                }
                return 0;
            }

            if (level > 52) {
                return this.pointCrossingsForLine(px, py, x0, y0, x1, y1);
            }
            let x0c: number = (x0 + xc) / 2;
            let y0c: number = (y0 + yc) / 2;
            let xc1: number = (xc + x1) / 2;
            let yc1: number = (yc + y1) / 2;
            xc              = (x0c + xc1) / 2;
            yc              = (y0c + yc1) / 2;
            if (Number.isNaN(xc) || Number.isNaN(yc)) {
                return 0;
            }
            return (this.pointCrossingsForQuad(px, py, x0, y0, x0c, y0c, xc, yc, level + 1) +
                    this.pointCrossingsForQuad(px, py, xc, yc, xc1, yc1, x1, y1, level + 1));
        }

        static pointCrossingsForCubic(px: number, py: number, x0: number, y0: number, xc0: number, yc0: number,
                                      xc1: number, yc1: number, x1: number, y1: number, level: number): number {
            if (py < y0 && py < yc0 && py < yc1 && py < y1) {
                return 0;
            }
            if (py >= y0 && py >= yc0 && py >= yc1 && py >= y1) {
                return 0;
            }
            if (px >= x0 && px >= xc0 && px >= xc1 && px >= x1) {
                return 0;
            }
            if (px < x0 && px < xc0 && px < xc1 && px < x1) {
                if (py >= y0) {
                    if (py < y1) {
                        return 1;
                    }
                } else {
                    if (py >= y1) {
                        return -1;
                    }
                }
                return 0;
            }
            if (level > 52) {
                return this.pointCrossingsForLine(px, py, x0, y0, x1, y1);
            }
            let xmid: number = (xc0 + xc1) / 2;
            let ymid: number = (yc0 + yc1) / 2;
            xc0              = (x0 + xc0) / 2;
            yc0              = (y0 + yc0) / 2;
            xc1              = (xc1 + x1) / 2;
            yc1              = (yc1 + y1) / 2;
            let xc0m: number = (xc0 + xmid) / 2;
            let yc0m: number = (yc0 + ymid) / 2;
            let xmc1: number = (xmid + xc1) / 2;
            let ymc1: number = (ymid + yc1) / 2;
            xmid             = (xc0m + xmc1) / 2;
            ymid             = (yc0m + ymc1) / 2;
            if (Number.isNaN(xmid) || Number.isNaN(ymid)) {
                return 0;
            }
            return (this.pointCrossingsForCubic(px, py, x0, y0, xc0, yc0, xc0m, yc0m, xmid, ymid, level + 1) +
                    this.pointCrossingsForCubic(px, py, xmid, ymid, xmc1, ymc1, xc1, yc1, x1, y1, level + 1));
        }

        static rectCrossingsForPath(pi: geom.PathIterator, rxmin: number, rymin: number, rxmax: number, rymax: number): number {
            if (rxmax <= rxmin || rymax <= rymin) {
                return 0;
            }
            if (pi.isDone()) {
                return 0;
            }
            let coords: number[] = [];
            if (pi.currentSegment(coords) != geom.SegmentType.MOVE_TO) {
                throw new SyntaxError("missing initial moveto in path definition");
            }
            pi.next();
            let curx, cury, movx, movy, endx, endy: number;
            curx = movx = coords[0];
            cury = movy = coords[1];
            let crossings: number = 0;
            while (crossings != this.RECT_INTERSECTS && !pi.isDone()) {
                switch (pi.currentSegment(coords)) {
                    case geom.SegmentType.MOVE_TO:
                        if (curx != movx || cury != movy) {
                            crossings = this.rectCrossingsForLine(crossings, rxmin, rymin, rxmax, rymax, curx, cury, movx, movy);
                        }
                        // Count should always be a multiple of 2 here.
                        // assert((crossings & 1) != 0);
                        movx = curx = coords[0];
                        movy = cury = coords[1];
                        break;
                    case geom.SegmentType.LINE_TO:
                        endx      = coords[0];
                        endy      = coords[1];
                        crossings = this.rectCrossingsForLine(crossings, rxmin, rymin, rxmax, rymax, curx, cury, endx, endy);
                        curx      = endx;
                        cury      = endy;
                        break;
                    case geom.SegmentType.QUAD_TO:
                        endx      = coords[2];
                        endy      = coords[3];
                        crossings = this.rectCrossingsForQuad(crossings, rxmin, rymin, rxmax, rymax, curx, cury, coords[0], coords[1], endx, endy, 0);
                        curx      = endx;
                        cury      = endy;
                        break;
                    case geom.SegmentType.CURVE_TO:
                        endx      = coords[4];
                        endy      = coords[5];
                        crossings = this.rectCrossingsForCubic(crossings, rxmin, rymin, rxmax, rymax, curx, cury, coords[0], coords[1], coords[2], coords[3], endx, endy, 0);
                        curx      = endx;
                        cury      = endy;
                        break;
                    case geom.SegmentType.CLOSE:
                        if (curx != movx || cury != movy) {
                            crossings = this.rectCrossingsForLine(crossings, rxmin, rymin, rxmax, rymax, curx, cury, movx, movy);
                        }
                        curx = movx;
                        cury = movy;
                        break;
                }
                pi.next();
            }
            if (crossings != this.RECT_INTERSECTS && (curx != movx || cury != movy)) {
                crossings = this.rectCrossingsForLine(crossings, rxmin, rymin, rxmax, rymax, curx, cury, movx, movy);
            }
            return crossings;
        }

        static rectCrossingsForLine(crossings: number, rxmin: number, rymin: number, rxmax: number, rymax: number,
                                    x0: number, y0: number, x1: number, y1: number): number {
            if (y0 >= rymax && y1 >= rymax) {
                return crossings;
            }
            if (y0 <= rymin && y1 <= rymin) {
                return crossings;
            }
            if (x0 <= rxmin && x1 <= rxmin) {
                return crossings;
            }
            if (x0 >= rxmax && x1 >= rxmax) {
                if (y0 < y1) {
                    if (y0 <= rymin) {
                        crossings++;
                    }
                    if (y1 >= rymax) {
                        crossings++;
                    }
                } else if (y1 < y0) {
                    if (y1 <= rymin) {
                        crossings--;
                    }
                    if (y0 >= rymax) {
                        crossings--;
                    }
                }
                return crossings;
            }
            if ((x0 > rxmin && x0 < rxmax && y0 > rymin && y0 < rymax) ||
                (x1 > rxmin && x1 < rxmax && y1 > rymin && y1 < rymax)) {
                return this.RECT_INTERSECTS;
            }
            let xi0: number = x0;
            if (y0 < rymin) {
                xi0 += ((rymin - y0) * (x1 - x0) / (y1 - y0));
            } else if (y0 > rymax) {
                xi0 += ((rymax - y0) * (x1 - x0) / (y1 - y0));
            }
            let xi1: number = x1;
            if (y1 < rymin) {
                xi1 += ((rymin - y1) * (x0 - x1) / (y0 - y1));
            } else if (y1 > rymax) {
                xi1 += ((rymax - y1) * (x0 - x1) / (y0 - y1));
            }
            if (xi0 <= rxmin && xi1 <= rxmin) {
                return crossings;
            }
            if (xi0 >= rxmax && xi1 >= rxmax) {
                if (y0 < y1) {
                    if (y0 <= rymin) {
                        crossings++;
                    }
                    if (y1 >= rymax) {
                        crossings++;
                    }
                } else if (y1 < y0) {
                    if (y1 <= rymin) {
                        crossings--;
                    }
                    if (y0 >= rymax) {
                        crossings--;
                    }
                }
                return crossings;
            }
            return this.RECT_INTERSECTS;
        }

        static rectCrossingsForQuad(crossings: number, rxmin: number, rymin: number, rxmax: number, rymax: number,
                                    x0: number, y0: number, xc: number, yc: number, x1: number, y1: number,
                                    level: number): number {
            if (y0 >= rymax && yc >= rymax && y1 >= rymax) {
                return crossings;
            }
            if (y0 <= rymin && yc <= rymin && y1 <= rymin) {
                return crossings;
            }
            if (x0 <= rxmin && xc <= rxmin && x1 <= rxmin) {
                return crossings;
            }
            if (x0 >= rxmax && xc >= rxmax && x1 >= rxmax) {
                if (y0 < y1) {
                    if (y0 <= rymin && y1 > rymin) {
                        crossings++;
                    }
                    if (y0 < rymax && y1 >= rymax) {
                        crossings++;
                    }
                } else if (y1 < y0) {
                    if (y1 <= rymin && y0 > rymin) {
                        crossings--;
                    }
                    if (y1 < rymax && y0 >= rymax) {
                        crossings--;
                    }
                }
                return crossings;
            }

            if ((x0 < rxmax && x0 > rxmin && y0 < rymax && y0 > rymin) ||
                (x1 < rxmax && x1 > rxmin && y1 < rymax && y1 > rymin)) {
                return this.RECT_INTERSECTS;
            }

            if (level > 52) {
                return this.rectCrossingsForLine(crossings, rxmin, rymin, rxmax, rymax, x0, y0, x1, y1);
            }
            let x0c: number = (x0 + xc) / 2;
            let y0c: number = (y0 + yc) / 2;
            let xc1: number = (xc + x1) / 2;
            let yc1: number = (yc + y1) / 2;
            xc              = (x0c + xc1) / 2;
            yc              = (y0c + yc1) / 2;
            if (Number.isNaN(xc) || Number.isNaN(yc)) {
                return 0;
            }
            crossings = this.rectCrossingsForQuad(crossings, rxmin, rymin, rxmax, rymax, x0, y0, x0c, y0c, xc, yc, level +
                                                                                                                   1);
            if (crossings != this.RECT_INTERSECTS) {
                crossings = this.rectCrossingsForQuad(crossings, rxmin, rymin, rxmax, rymax, xc, yc, xc1, yc1, x1, y1, level +
                                                                                                                       1);
            }
            return crossings;
        }

        static rectCrossingsForCubic(crossings: number, rxmin: number, rymin: number, rxmax: number, rymax: number,
                                     x0: number, y0: number, xc0: number, yc0: number, xc1: number, yc1: number,
                                     x1: number, y1: number, level: number): number {
            if (y0 >= rymax && yc0 >= rymax && yc1 >= rymax && y1 >= rymax) {
                return crossings;
            }
            if (y0 <= rymin && yc0 <= rymin && yc1 <= rymin && y1 <= rymin) {
                return crossings;
            }
            if (x0 <= rxmin && xc0 <= rxmin && xc1 <= rxmin && x1 <= rxmin) {
                return crossings;
            }
            if (x0 >= rxmax && xc0 >= rxmax && xc1 >= rxmax && x1 >= rxmax) {
                if (y0 < y1) {
                    if (y0 <= rymin && y1 > rymin) {
                        crossings++;
                    }
                    if (y0 < rymax && y1 >= rymax) {
                        crossings++;
                    }
                } else if (y1 < y0) {
                    if (y1 <= rymin && y0 > rymin) {
                        crossings--;
                    }
                    if (y1 < rymax && y0 >= rymax) {
                        crossings--;
                    }
                }
                return crossings;
            }

            if ((x0 > rxmin && x0 < rxmax && y0 > rymin && y0 < rymax) ||
                (x1 > rxmin && x1 < rxmax && y1 > rymin && y1 < rymax)) {
                return this.RECT_INTERSECTS;
            }

            if (level > 52) {
                return this.rectCrossingsForLine(crossings, rxmin, rymin, rxmax, rymax, x0, y0, x1, y1);
            }
            let xmid: number = (xc0 + xc1) / 2;
            let ymid: number = (yc0 + yc1) / 2;
            xc0              = (x0 + xc0) / 2;
            yc0              = (y0 + yc0) / 2;
            xc1              = (xc1 + x1) / 2;
            yc1              = (yc1 + y1) / 2;
            let xc0m: number = (xc0 + xmid) / 2;
            let yc0m: number = (yc0 + ymid) / 2;
            let xmc1: number = (xmid + xc1) / 2;
            let ymc1: number = (ymid + yc1) / 2;
            xmid             = (xc0m + xmc1) / 2;
            ymid             = (yc0m + ymc1) / 2;
            if (Number.isNaN(xmid) || Number.isNaN(ymid)) {
                return 0;
            }
            crossings = this.rectCrossingsForCubic(crossings, rxmin, rymin, rxmax, rymax, x0, y0, xc0, yc0, xc0m, yc0m, xmid, ymid, level +
                                                                                                                                    1);
            if (crossings != this.RECT_INTERSECTS) {
                crossings = this.rectCrossingsForCubic(crossings, rxmin, rymin, rxmax, rymax, xmid, ymid, xmc1, ymc1, xc1, yc1, x1, y1, level +
                                                                                                                                        1);
            }
            return crossings;
        }


        static intersectsLine(rx1: number, ry1: number, rwidth: number, rheight: number, x1: number, y1: number, x2: number, y2: number): boolean {
            let out1, out2: number;
            if ((out2 = this.outcode(rx1, ry1, rwidth, rheight, x2, y2)) == 0) {
                return true;
            }
            while ((out1 = this.outcode(rx1, ry1, rwidth, rheight, x1, y1)) != 0) {
                if ((out1 & out2) != 0) {
                    return false;
                }
                if ((out1 & (this.OUT_LEFT | this.OUT_RIGHT)) != 0) {
                    if ((out1 & this.OUT_RIGHT) != 0) {
                        rx1 += rwidth;
                    }
                    y1 = y1 + (rx1 - x1) * (y2 - y1) / (x2 - x1);
                    x1 = rx1;
                } else {
                    if ((out1 & this.OUT_BOTTOM) != 0) {
                        ry1 += rheight;
                    }
                    x1 = x1 + (ry1 - y1) * (x2 - x1) / (y2 - y1);
                    y1 = ry1;
                }
            }
            return true;
        }

        static outcode(rx: number, ry: number, rwidth: number, rheight: number, x: number, y: number): number {
            let out: number = 0;
            if (rwidth <= 0) {
                out |= this.OUT_LEFT | this.OUT_RIGHT;
            } else if (x < rx) {
                out |= this.OUT_LEFT;
            } else if (x > rx + rwidth) {
                out |= this.OUT_RIGHT;
            }
            if (rheight <= 0) {
                out |= this.OUT_TOP | this.OUT_BOTTOM;
            } else if (y < ry) {
                out |= this.OUT_TOP;
            } else if (y > ry + rheight) {
                out |= this.OUT_BOTTOM;
            }
            return out;
        }

        static accumulate(bbox: number[], s: Shape, tx: geom.transform.BaseTransform): void {
            let pi: geom.PathIterator = s.getPathIterator(tx);
            let coords: number[]      = [];
            let mx: number            = 0, my = 0, x0 = 0, y0 = 0, x1, y1;
            while (!pi.isDone()) {
                switch (pi.currentSegment(coords)) {
                    case geom.SegmentType.MOVE_TO:
                        mx = coords[0];
                        my = coords[1];
                    case geom.SegmentType.LINE_TO:
                        x0 = coords[0];
                        y0 = coords[1];
                        if (bbox[0] > x0) {
                            bbox[0] = x0;
                        }
                        if (bbox[1] > y0) {
                            bbox[1] = y0;
                        }
                        if (bbox[2] < x0) {
                            bbox[2] = x0;
                        }
                        if (bbox[3] < y0) {
                            bbox[3] = y0;
                        }
                        break;
                    case geom.SegmentType.QUAD_TO:
                        x1 = coords[2];
                        y1 = coords[3];
                        if (bbox[0] > x1) {
                            bbox[0] = x1;
                        }
                        if (bbox[1] > y1) {
                            bbox[1] = y1;
                        }
                        if (bbox[2] < x1) {
                            bbox[2] = x1;
                        }
                        if (bbox[3] < y1) {
                            bbox[3] = y1;
                        }
                        if (bbox[0] > coords[0] || bbox[2] < coords[0]) {
                            this.accumulateQuad(bbox, 0, x0, coords[0], x1);
                        }
                        if (bbox[1] > coords[1] || bbox[3] < coords[1]) {
                            this.accumulateQuad(bbox, 1, y0, coords[1], y1);
                        }
                        x0 = x1;
                        y0 = y1;
                        break;
                    case geom.SegmentType.CURVE_TO:
                        x1 = coords[4];
                        y1 = coords[5];
                        if (bbox[0] > x1) {
                            bbox[0] = x1;
                        }
                        if (bbox[1] > y1) {
                            bbox[1] = y1;
                        }
                        if (bbox[2] < x1) {
                            bbox[2] = x1;
                        }
                        if (bbox[3] < y1) {
                            bbox[3] = y1;
                        }
                        if (bbox[0] > coords[0] || bbox[2] < coords[0] || bbox[0] > coords[2] || bbox[2] < coords[2]) {
                            this.accumulateCubic(bbox, 0, x0, coords[0], coords[2], x1);
                        }
                        if (bbox[1] > coords[1] || bbox[3] < coords[1] || bbox[1] > coords[3] || bbox[3] < coords[3]) {
                            this.accumulateCubic(bbox, 1, y0, coords[1], coords[3], y1);
                        }
                        x0 = x1;
                        y0 = y1;
                        break;
                    case geom.SegmentType.CLOSE:
                        x0 = mx;
                        y0 = my;
                        break;
                }
                pi.next();
            }
        }

        static accumulateQuad(bbox: number[], off: number, v0: number, vc: number, v1: number): void {
            let num: number = v0 - vc;
            let den: number = v1 - vc + num;
            if (den != 0) {
                let t: number = num / den;
                if (t > 0 && t < 1) {
                    let u: number = 1 - t;
                    let v: number = v0 * u * u + 2 * vc * t * u + v1 * t * t;
                    if (bbox[off] > v) {
                        bbox[off] = v;
                    }
                    if (bbox[off + 2] < v) {
                        bbox[off + 2] = v;
                    }
                }
            }
        }

        static accumulateCubic(bbox: number[], off: number, v0: number, vc0: number, vc1: number, v1: number): void {
            let c: number = vc0 - v0;
            let b: number = 2 * ((vc1 - vc0) - c);
            let a: number = (v1 - vc1) - b - c;
            if (a == 0) {
                if (b == 0) {
                    return;
                }
                this.accumulateCubic(bbox, off, -c / b, v0, vc0, vc1, v1);
            } else {
                let d: number = b * b - 4 * a * c;
                if (d < 0) {
                    return;
                }
                d = Math.sqrt(d);

                if (b < 0) {
                    d = -d;
                }
                let q: number = (b + d) / -2;
                this.accumulateCubic(bbox, off, q / a, v0, vc0, vc1, v1);
                if (q != 0) {
                    this.accumulateCubic(bbox, off, c / q, v0, vc0, vc1, v1);
                }
            }
        }

        static accumulateCubic(bbox: number[], off: number, t: number, v0: number, vc0: number, vc1: number, v1: number): void {
            if (t > 0 && t < 1) {
                let u: number = 1 - t;
                let v: number = v0 * u * u * u + 3 * vc0 * t * u * u + 3 * vc1 * t * t * u + v1 * t * t * t;
                if (bbox[off] > v) {
                    bbox[off] = v;
                }
                if (bbox[off + 2] < v) {
                    bbox[off + 2] = v;
                }
            }
        }

        getNgNode(): scene.NGNode {
            return undefined;
        }
    }

    export abstract class RectangularShape extends geom.Shape {

        protected RectangularShape() {
        }

        abstract getX(): number;

        abstract getY(): number;

        abstract getWidth(): number;

        abstract getHeight(): number;

        getMinX(): number {
            return this.getX();
        }

        getMinY(): number {
            return this.getY();
        }

        getMaxX(): number {
            return this.getX() + this.getWidth();
        }

        getMaxY(): number {
            return this.getY() + this.getHeight();
        }

        getCenterX(): number {
            return this.getX() + this.getWidth() / 2;
        }

        getCenterY() {
            return this.getY() + this.getHeight() / 2;
        }

        abstract isEmpty(): boolean;

        abstract setFrame(x: number, y: number, w: number, h: number): void;

        setFrame(loc: geom.Point2D, size: Dimension2D): void {
            this.setFrame(loc.x, loc.y, size.width, size.height);
        }

        setFrameFromDiagonal(x1: number, y1: number, x2: number, y2: number): void {
            if (x2 < x1) {
                let t: number = x1;
                x1            = x2;
                x2            = t;
            }
            if (y2 < y1) {
                let t: number = y1;
                y1            = y2;
                y2            = t;
            }
            this.setFrame(x1, y1, x2 - x1, y2 - y1);
        }

        setFrameFromDiagonal(p1: geom.Point2D, p2: geom.Point2D): void {
            this.setFrameFromDiagonal(p1.x, p1.y, p2.x, p2.y);
        }

        setFrameFromCenter(centerX: number, centerY: number, cornerX: number, cornerY: number): void {
            let halfW: number = Math.abs(cornerX - centerX);
            let halfH: number = Math.abs(cornerY - centerY);
            this.setFrame(centerX - halfW, centerY - halfH, halfW * 2, halfH * 2);
        }


        setFrameFromCenter(center: geom.Point2D, corner: geom.Point2D): void {
            this.setFrameFromCenter(center.x, center.y, corner.x, corner.y);
        }

        contains(p: Point2D): boolean {
            return this.contains(p.x, p.y);
        }

        getBounds(): geom.RectBounds {
            let width: number  = this.getWidth();
            let height: number = this.getHeight();
            if (width < 0 || height < 0) {
                return new geom.RectBounds();
            }
            let x: number  = this.getX();
            let y: number  = this.getY();
            let x1: number = Math.floor(x);
            let y1: number = Math.floor(y);
            let x2: number = Math.ceil(x + width);
            let y2: number = Math.ceil(y + height);
            return new geom.RectBounds(x1, y1, x2, y2);
        }

        getPathIterator(tx: geom.transform.BaseTransform, flatness: number): geom.PathIterator {
            return new FlatteningPathIterator(this.getPathIterator(tx), flatness);
        }

    }
}