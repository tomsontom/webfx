namespace geom {
    export abstract class Shape {
        abstract getBounds() : geom.RectBounds;

        abstract contains(x : number, y : number) : boolean;

        public contains(p : geom.Point2D) : boolean{
            return contains(p.x, p.y);
        }

        abstract intersects(x : number, y : number, w : number, h : number) : boolean;

        intersects(r : geom.RectBounds) : boolean {
            let x : number = r.getMinX();
            let y : number = r.getMinY();
            let w : number = r.getMaxX() - x;
            let h : number = r.getMaxY() - y;
            return this.intersects(x, y, w, h);
        }

        abstract contains(x : number, y : number, w : number, h : number) : boolean;

        contains(r : geom.RectBounds) : boolean {
            let x : number = r.getMinX();
            let y : number = r.getMinY();
            let w : number = r.getMaxX() - x;
            let h : number = r.getMaxY() - y;
            return this.contains(x, y, w, h);
        }

        abstract getPathIterator(tx : geom.BaseTransform) : geom.PathIterator;

        abstract getPathIterator(tx : geom.BaseTransform, flatness : number) : geom.PathIterator;

        abstract copy() : geom.Shape;

        static pointCrossingsForPath(pi : PathIterator, px : number, py : number) : number {
            if (pi.isDone()) {
                return 0;
            }
            let coords : number[] = [];
            if (pi.currentSegment(coords) != geom.SegmentType.MOVE_TO) {
                throw new SyntaxError("missing initial moveto in path definition");
            }
            pi.next();
            let movx : number = coords[0];
            let movy : number = coords[1];
            let curx : number = movx;
            let cury : number = movy;
            let endx : number;
            let endy : number;
            let crossings : number = 0;
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


        static pointCrossingsForLine(px : number, py : number, x0 : number, y0 : number, x1 : number, y1 : number) : number {
            if (py <  y0 && py <  y1) return 0;
            if (py >= y0 && py >= y1) return 0;
            // assert(y0 != y1);
            if (px >= x0 && px >= x1) return 0;
            if (px <  x0 && px <  x1) return (y0 < y1) ? 1 : -1;
            let xintercept : number = x0 + (py - y0) * (x1 - x0) / (y1 - y0);
            if (px >= xintercept) return 0;
            return (y0 < y1) ? 1 : -1;
        }

        static pointCrossingsForQuad(px : number, py : number,
                                     x0 : number, y0 : number,
                                     xc : number, yc : number,
                                     x1 : number, y1 : number, level : number) : number {
            if (py <  y0 && py <  yc && py <  y1) return 0;
            if (py >= y0 && py >= yc && py >= y1) return 0;
            if (px >= x0 && px >= xc && px >= x1) return 0;
            if (px <  x0 && px <  xc && px <  x1) {
                if (py >= y0) {
                    if (py < y1) return 1;
                } else {
                    if (py >= y1) return -1;
                }
                return 0;
            }

            if (level > 52) return this.pointCrossingsForLine(px, py, x0, y0, x1, y1);
            let x0c : number = (x0 + xc) / 2;
            let y0c : number  = (y0 + yc) / 2;
            let xc1 : number  = (xc + x1) / 2;
            let yc1 : number  = (yc + y1) / 2;
            xc = (x0c + xc1) / 2;
            yc = (y0c + yc1) / 2;
            if (Number.isNaN(xc) || Number.isNaN(yc)) {
                return 0;
            }
            return (this.pointCrossingsForQuad(px, py, x0, y0, x0c, y0c, xc, yc, level+1) +
                    this.pointCrossingsForQuad(px, py, xc, yc, xc1, yc1, x1, y1, level+1));
        }

        static pointCrossingsForCubic(px : number, py : number,
                                      x0 : number, y0 : number,
                                      xc0 : number, yc0 : number,
                                      xc1 : number, yc1 : number,
                                      x1 : number, y1 : number, level : number) : number {
            if (py <  y0 && py <  yc0 && py <  yc1 && py <  y1) return 0;
            if (py >= y0 && py >= yc0 && py >= yc1 && py >= y1) return 0;
            if (px >= x0 && px >= xc0 && px >= xc1 && px >= x1) return 0;
            if (px <  x0 && px <  xc0 && px <  xc1 && px <  x1) {
                if (py >= y0) {
                    if (py < y1) return 1;
                } else {
                    if (py >= y1) return -1;
                }
                return 0;
            }
            if (level > 52) return this.pointCrossingsForLine(px, py, x0, y0, x1, y1);
            let xmid : number = (xc0 + xc1) / 2;
            let ymid : number = (yc0 + yc1) / 2;
            xc0 = (x0 + xc0) / 2;
            yc0 = (y0 + yc0) / 2;
            xc1 = (xc1 + x1) / 2;
            yc1 = (yc1 + y1) / 2;
            let xc0m : number = (xc0 + xmid) / 2;
            let yc0m : number = (yc0 + ymid) / 2;
            let xmc1 : number = (xmid + xc1) / 2;
            let ymc1 : number = (ymid + yc1) / 2;
            xmid = (xc0m + xmc1) / 2;
            ymid = (yc0m + ymc1) / 2;
            if (Number.isNaN(xmid) || Number.isNaN(ymid)) {
                return 0;
            }
            return (this.pointCrossingsForCubic(px, py, x0, y0, xc0, yc0, xc0m, yc0m, xmid, ymid, level+1) +
                    this.pointCrossingsForCubic(px, py, xmid, ymid, xmc1, ymc1, xc1, yc1, x1, y1, level+1));
        }

        static readonly RECT_INTERSECTS : number = 0x80000000;

        static rectCrossingsForPath(pi : geom.PathIterator,
                                    rxmin : number, rymin : number,
                                    rxmax : number, rymax : number) : number {
        if (rxmax <= rxmin || rymax <= rymin) {
            return 0;
        }
        if (pi.isDone()) {
            return 0;
        }
        let coords : number[] = [];
        if (pi.currentSegment(coords) != geom.SegmentType.MOVE_TO) {
            throw new SyntaxError("missing initial moveto in path definition");
        }
        pi.next();
        let curx, cury, movx, movy, endx, endy : number;
        curx = movx = coords[0];
        cury = movy = coords[1];
        let crossings : number = 0;
        while (crossings != this.RECT_INTERSECTS && !pi.isDone()) {
            switch (pi.currentSegment(coords)) {
                case geom.SegmentType.MOVE_TO:
                    if (curx != movx || cury != movy) {
                        crossings = this.rectCrossingsForLine(crossings,
                            rxmin, rymin,
                            rxmax, rymax,
                            curx, cury,
                            movx, movy);
                    }
                    // Count should always be a multiple of 2 here.
                    // assert((crossings & 1) != 0);
                    movx = curx = coords[0];
                    movy = cury = coords[1];
                    break;
                case geom.SegmentType.LINE_TO:
                    endx = coords[0];
                    endy = coords[1];
                    crossings = this.rectCrossingsForLine(crossings,
                        rxmin, rymin,
                        rxmax, rymax,
                        curx, cury,
                        endx, endy);
                    curx = endx;
                    cury = endy;
                    break;
                case geom.SegmentType.QUAD_TO:
                    endx = coords[2];
                    endy = coords[3];
                    crossings = this.rectCrossingsForQuad(crossings,
                        rxmin, rymin,
                        rxmax, rymax,
                        curx, cury,
                        coords[0], coords[1],
                        endx, endy, 0);
                    curx = endx;
                    cury = endy;
                    break;
                case geom.SegmentType.CURVE_TO:
                    endx = coords[4];
                    endy = coords[5];
                    crossings = this.rectCrossingsForCubic(crossings,
                        rxmin, rymin,
                        rxmax, rymax,
                        curx, cury,
                        coords[0], coords[1],
                        coords[2], coords[3],
                        endx, endy, 0);
                    curx = endx;
                    cury = endy;
                    break;
                case geom.SegmentType.CLOSE:
                    if (curx != movx || cury != movy) {
                        crossings = this.rectCrossingsForLine(crossings,
                            rxmin, rymin,
                            rxmax, rymax,
                            curx, cury,
                            movx, movy);
                    }
                    curx = movx;
                    cury = movy;
                    break;
            }
            pi.next();
        }
        if (crossings != this.RECT_INTERSECTS && (curx != movx || cury != movy)) {
            crossings = this.rectCrossingsForLine(crossings,
                rxmin, rymin,
                rxmax, rymax,
                curx, cury,
                movx, movy);
        }
        return crossings;
    }


    static rectCrossingsForLine(crossings : number,
                                rxmin : number, rymin : number,
                                rxmax : number, rymax : number,
                                x0 : number, y0 : number,
                                x1 : number, y1 : number) : number {
        if (y0 >= rymax && y1 >= rymax) return crossings;
        if (y0 <= rymin && y1 <= rymin) return crossings;
        if (x0 <= rxmin && x1 <= rxmin) return crossings;
        if (x0 >= rxmax && x1 >= rxmax) {
            if (y0 < y1) {
                if (y0 <= rymin) crossings++;
                if (y1 >= rymax) crossings++;
            } else if (y1 < y0) {
                if (y1 <= rymin) crossings--;
                if (y0 >= rymax) crossings--;
            }
            return crossings;
        }
        if ((x0 > rxmin && x0 < rxmax && y0 > rymin && y0 < rymax) ||
            (x1 > rxmin && x1 < rxmax && y1 > rymin && y1 < rymax))
        {
            return this.RECT_INTERSECTS;
        }
        let xi0 : number = x0;
        if (y0 < rymin) {
            xi0 += ((rymin - y0) * (x1 - x0) / (y1 - y0));
        } else if (y0 > rymax) {
            xi0 += ((rymax - y0) * (x1 - x0) / (y1 - y0));
        }
        let xi1 : number = x1;
        if (y1 < rymin) {
            xi1 += ((rymin - y1) * (x0 - x1) / (y0 - y1));
        } else if (y1 > rymax) {
            xi1 += ((rymax - y1) * (x0 - x1) / (y0 - y1));
        }
        if (xi0 <= rxmin && xi1 <= rxmin) return crossings;
        if (xi0 >= rxmax && xi1 >= rxmax) {
            if (y0 < y1) {
                if (y0 <= rymin) crossings++;
                if (y1 >= rymax) crossings++;
            } else if (y1 < y0) {
                if (y1 <= rymin) crossings--;
                if (y0 >= rymax) crossings--;
            }
            return crossings;
        }
        return this.RECT_INTERSECTS;
    }

    static rectCrossingsForQuad(crossings : number,
        rxmin : number, rymin : number,
        rxmax : number, rymax : number,
        x0 : number, y0 : number,
        xc : number, yc : number,
        x1 : number, y1 : number,
        level : number) : number {
            if (y0 >= rymax && yc >= rymax && y1 >= rymax) return crossings;
            if (y0 <= rymin && yc <= rymin && y1 <= rymin) return crossings;
            if (x0 <= rxmin && xc <= rxmin && x1 <= rxmin) return crossings;
            if (x0 >= rxmax && xc >= rxmax && x1 >= rxmax) {
                if (y0 < y1) {
                    if (y0 <= rymin && y1 >  rymin) crossings++;
                    if (y0 <  rymax && y1 >= rymax) crossings++;
                } else if (y1 < y0) {
                    if (y1 <= rymin && y0 >  rymin) crossings--;
                    if (y1 <  rymax && y0 >= rymax) crossings--;
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
        let x0c : number = (x0 + xc) / 2;
        let y0c : number = (y0 + yc) / 2;
        let xc1 : number = (xc + x1) / 2;
        let yc1 : number = (yc + y1) / 2;
        xc = (x0c + xc1) / 2;
        yc = (y0c + yc1) / 2;
        if (Number.isNaN(xc) || Number.isNaN(yc)) {
            return 0;
        }
        crossings = this.rectCrossingsForQuad(crossings,
            rxmin, rymin, rxmax, rymax,
            x0, y0, x0c, y0c, xc, yc,
            level+1);
        if (crossings != this.RECT_INTERSECTS) {
            crossings = this.rectCrossingsForQuad(crossings, rxmin, rymin, rxmax, rymax, xc, yc, xc1, yc1, x1, y1,level+1);
        }
        return crossings;
    }

    static rectCrossingsForCubic(crossings : number,
        rxmin : number, rymin : number,
        rxmax : number, rymax : number,
        x0 : number,  y0 : number,
        xc0 : number, yc0 : number,
        xc1 : number, yc1 : number,
        x1 : number,  y1 : number,
        level : number) : number {
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
                if (y0 <= rymin && y1 >  rymin) crossings++;
                if (y0 <  rymax && y1 >= rymax) crossings++;
            } else if (y1 < y0) {
                if (y1 <= rymin && y0 >  rymin) crossings--;
                if (y1 <  rymax && y0 >= rymax) crossings--;
            }
            return crossings;
        }

        if ((x0 > rxmin && x0 < rxmax && y0 > rymin && y0 < rymax) || (x1 > rxmin && x1 < rxmax && y1 > rymin && y1 < rymax)) {
            return this.RECT_INTERSECTS;
        }

        if (level > 52) {
            return this.rectCrossingsForLine(crossings, rxmin, rymin, rxmax, rymax, x0, y0, x1, y1);
        }
        let xmid : number = (xc0 + xc1) / 2;
        let ymid : number= (yc0 + yc1) / 2;
        xc0 = (x0 + xc0) / 2;
        yc0 = (y0 + yc0) / 2;
        xc1 = (xc1 + x1) / 2;
        yc1 = (yc1 + y1) / 2;
        let xc0m : number = (xc0 + xmid) / 2;
        let yc0m : number = (yc0 + ymid) / 2;
        let xmc1 : number = (xmid + xc1) / 2;
        let ymc1 : number = (ymid + yc1) / 2;
        xmid = (xc0m + xmc1) / 2;
        ymid = (yc0m + ymc1) / 2;
        if (Number.isNaN(xmid) || Number.isNaN(ymid)) {
            return 0;
        }
        crossings = this.rectCrossingsForCubic(crossings,
            rxmin, rymin, rxmax, rymax,
            x0, y0, xc0, yc0,
            xc0m, yc0m, xmid, ymid, level+1);
        if (crossings != this.RECT_INTERSECTS) {
            crossings = this.rectCrossingsForCubic(crossings, rxmin, rymin, rxmax, rymax, xmid, ymid, xmc1, ymc1, xc1, yc1, x1, y1, level+1);
        }
        return crossings;
    }

    /*               */
static boolean intersectsLine(float rx1, float ry1, float rwidth,
        float rheight, float x1, float y1, float x2, float y2)
    {
        int out1, out2;
        if ((out2 = outcode(rx1, ry1, rwidth, rheight, x2, y2)) == 0) {
            return true;
        }
        while ((out1 = outcode(rx1, ry1, rwidth, rheight, x1, y1)) != 0) {
            if ((out1 & out2) != 0) {
                return false;
            }
            if ((out1 & (OUT_LEFT | OUT_RIGHT)) != 0) {
                if ((out1 & OUT_RIGHT) != 0) {
                    rx1 += rwidth;
                }
                y1 = y1 + (rx1 - x1)                x1 = rx1;
            } else {
                if ((out1 & OUT_BOTTOM) != 0) {
                    ry1 += rheight;
                }
                x1 = x1 + (ry1 - y1)                y1 = ry1;
            }
        }
        return true;
    }

    /*          */
static int outcode(float rx, float ry, float rwidth, float rheight, float x, float y) {
        /                  */
        int out = 0;
        if (rwidth <= 0) {
            out |= OUT_LEFT | OUT_RIGHT;
        } else if (x < rx) {
            out |= OUT_LEFT;
        } else if (x > rx + (double) rwidth) {
            out |= OUT_RIGHT;
        }
        if (rheight <= 0) {
            out |= OUT_TOP | OUT_BOTTOM;
        } else if (y < ry) {
            out |= OUT_TOP;
        } else if (y > ry + (double) rheight) {
            out |= OUT_BOTTOM;
        }
        return out;
    }

    /*               */
public static final int OUT_LEFT = 1;

    /*               */
public static final int OUT_TOP = 2;

    /*               */
public static final int OUT_RIGHT = 4;

    /*               */
public static final int OUT_BOTTOM = 8;

public static void accumulate(float bbox[], Shape s, BaseTransform tx) {
        // Note that this is turned off since we cannot guarantee
        // that the shape implementation will calculate minimal bounds
        // without a little more work on the javafx.geom classes...
        //        if (tx.isIdentity()) {
        //            // The shape itself will often have a more optimal algorithm
        //            // to calculate the untransformed bounds...
        //            RectBounds r2d = s.getBounds();
        //            if (bbox[0] > r2d.getMinX()) bbox[0] = r2d.getMinX();
        //            if (bbox[1] > r2d.getMinY()) bbox[1] = r2d.getMinY();
        //            if (bbox[2] < r2d.getMaxX()) bbox[2] = r2d.getMaxX();
        //            if (bbox[3] < r2d.getMaxY()) bbox[3] = r2d.getMaxY();
        //            return;
        //        }
        PathIterator pi = s.getPathIterator(tx);
        float coords[] = new float[6];
        float mx = 0f, my = 0f, x0 = 0f, y0 = 0f, x1, y1;
        while (!pi.isDone()) {
            switch (pi.currentSegment(coords)) {
                case PathIterator.SEG_MOVETO:
                    mx = coords[0];
                    my = coords[1];
                    /                case PathIterator.SEG_LINETO:
                    x0 = coords[0];
                    y0 = coords[1];
                    if (bbox[0] > x0) bbox[0] = x0;
                    if (bbox[1] > y0) bbox[1] = y0;
                    if (bbox[2] < x0) bbox[2] = x0;
                    if (bbox[3] < y0) bbox[3] = y0;
                    break;
                case PathIterator.SEG_QUADTO:
                    x1 = coords[2];
                    y1 = coords[3];
                    if (bbox[0] > x1) bbox[0] = x1;
                    if (bbox[1] > y1) bbox[1] = y1;
                    if (bbox[2] < x1) bbox[2] = x1;
                    if (bbox[3] < y1) bbox[3] = y1;
                    if (bbox[0] > coords[0] || bbox[2] < coords[0]) {
                        accumulateQuad(bbox, 0, x0, coords[0], x1);
                    }
                    if (bbox[1] > coords[1] || bbox[3] < coords[1]) {
                        accumulateQuad(bbox, 1, y0, coords[1], y1);
                    }
                    x0 = x1;
                    y0 = y1;
                    break;
                case PathIterator.SEG_CUBICTO:
                    x1 = coords[4];
                    y1 = coords[5];
                    if (bbox[0] > x1) bbox[0] = x1;
                    if (bbox[1] > y1) bbox[1] = y1;
                    if (bbox[2] < x1) bbox[2] = x1;
                    if (bbox[3] < y1) bbox[3] = y1;
                    if (bbox[0] > coords[0] || bbox[2] < coords[0] ||
                        bbox[0] > coords[2] || bbox[2] < coords[2])
                    {
                        accumulateCubic(bbox, 0, x0, coords[0], coords[2], x1);
                    }
                    if (bbox[1] > coords[1] || bbox[3] < coords[1] ||
                        bbox[1] > coords[3] || bbox[3] < coords[3])
                    {
                        accumulateCubic(bbox, 1, y0, coords[1], coords[3], y1);
                    }
                    x0 = x1;
                    y0 = y1;
                    break;
                case PathIterator.SEG_CLOSE:
                    x0 = mx;
                    y0 = my;
                    break;
            }
            pi.next();
        }
    }

public static void accumulateQuad(float bbox[], int off,
        float v0, float vc, float v1)
    {
        // Breaking this quad down into a polynomial:
        // eqn[0] = v0;
        // eqn[1] = vc + vc - v0 - v0;
        // eqn[2] = v0 - vc - vc + v1;
        // Deriving the polynomial:
        // eqn'[0] = 1*eqn[1] = 2*(vc-v0)
        // eqn'[1] = 2*eqn[2] = 2*((v1-vc)-(vc-v0))
        // Solving for zeroes on the derivative:
        // e1*t + e0 = 0
        // t = -e0/e1;
        // t = -2(vc-v0) / 2((v1-vc)-(vc-v0))
        // t = (v0-vc) / (v1-vc+v0-vc)
        float num = v0 - vc;
        float den = v1 - vc + num;
        if (den != 0f) {
        float t = num / den;
        if (t > 0 && t < 1) {
            float u = 1f - t;
            float v = v0                 if (bbox[off] > v) bbox[off] = v;
            if (bbox[off+2] < v) bbox[off+2] = v;
        }
    }
    }

public static void accumulateCubic(float bbox[], int off,
        float v0, float vc0, float vc1, float v1)
    {
        // Breaking this cubic down into a polynomial:
        // eqn[0] = v0;
        // eqn[1] = (vc0 - v0)         // eqn[2] = (vc1 - vc0 - vc0 + v0)         // eqn[3] = v1 + (vc0 - vc1)         // Deriving the polynomial:
        // eqn'[0] = 1*eqn[1] = 3(vc0-v0)
        // eqn'[1] = 2*eqn[2] = 6((vc1-vc0)-(vc0-v0))
        // eqn'[2] = 3*eqn[3] = 3((v1-vc1)-2(vc1-vc0)+(vc0-v0))
        // Solving for zeroes on the derivative:
        // e2*t*t + e1*t + e0 = a*t*t + b*t + c = 0
        // Note that in solving for 0 we can divide all e0,e1,e2 by 3
        // t = (-b +/- sqrt(b*b-4ac))/2a
        float c = vc0 - v0;
        float b = 2f         float a = (v1 - vc1) - b - c;
        if (a == 0f) {
        // The quadratic parabola has degenerated to a line.
        if (b == 0f) {
            // The line has degenerated to a constant.
            return;
        }
        accumulateCubic(bbox, off, -c/b, v0, vc0, vc1, v1);
    } else {
        // From Numerical Recipes, 5.6, Quadratic and Cubic Equations
        float d = b             if (d < 0f) {
            // If d < 0.0, then there are no roots
            return;
        }
        d = (float) Math.sqrt(d);
        // For accuracy, calculate one root using:
        //     (-b +/- d) / 2a
        // and the other using:
        //     2c / (-b +/- d)
        // Choose the sign of the +/- so that b+d gets larger in magnitude
        if (b < 0f) {
            d = -d;
        }
        float q = (b + d) / -2f;
        // We already tested a for being 0 above
        accumulateCubic(bbox, off, q/a, v0, vc0, vc1, v1);
        if (q != 0f) {
            accumulateCubic(bbox, off, c/q, v0, vc0, vc1, v1);
        }
    }
    }

public static void accumulateCubic(float bbox[], int off, float t,
        float v0, float vc0, float vc1, float v1)
    {
        if (t > 0 && t < 1) {
            float u = 1f - t;
            float v =        v0                       + 3                       + 3                       +      v1             if (bbox[off] > v) bbox[off] = v;
            if (bbox[off+2] < v) bbox[off+2] = v;
        }
    }
    }

    export abstract class RectangularShape extends geom.Shape {

        protected constructor() {
            super();
        }


        abstract getX() : number;

        abstract getY() : number;

        abstract getWidth() : number;

        abstract getHeight() : number;

        getMinX() : number {
            return this.minX;
        }





        getNgNode(): scene.NGNode {
            return undefined;
        }
    }
}