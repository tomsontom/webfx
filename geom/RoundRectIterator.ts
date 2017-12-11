namespace geom {
    export class RoundRectIterator implements geom.PathIterator{
        x         : number;
        y         : number;
        w         : number;
        h         : number;
        aw        : number;
        ah        : number;
        transform : geom.transform.BaseTransform;
        index     : number;

        static readonly angle   : number     = Math.PI / 4.0;
        static readonly a       : number     = 1.0 - Math.cos(RoundRectIterator.angle);
        static readonly b       : number     = Math.tan(RoundRectIterator.angle);
        static readonly c       : number     = Math.sqrt(1.0 + RoundRectIterator.b * RoundRectIterator.b) - 1 + RoundRectIterator.a;
        static readonly cv      : number     = 4.0 / 3.0 * RoundRectIterator.a * RoundRectIterator.b / RoundRectIterator.c;
        static readonly acv     : number     = (1.0 - RoundRectIterator.cv) / 2.0;
        static readonly ctrlpts : number[][] = [
            [  0.0,  0.0,  0.0,  0.5 ],
            [  0.0,  0.0,  1.0, -0.5 ],
            [  0.0,  0.0,  1.0, -RoundRectIterator.acv,
               0.0,  RoundRectIterator.acv,  1.0,  0.0,
               0.0,  0.5,  1.0,  0.0 ],
            [  1.0, -0.5,  1.0,  0.0 ],
            [  1.0, -RoundRectIterator.acv,  1.0,  0.0,
               1.0,  0.0,  1.0, -RoundRectIterator.acv,
               1.0,  0.0,  1.0, -0.5 ],
            [  1.0,  0.0,  0.0,  0.5 ],
            [  1.0,  0.0,  0.0,  RoundRectIterator.acv,
               1.0, -RoundRectIterator.acv,  0.0,  0.0,
               1.0, -0.5,  0.0,  0.0 ],
            [  0.0,  0.5,  0.0,  0.0 ],
            [  0.0,  RoundRectIterator.acv,  0.0,  0.0,
               0.0,  0.0,  0.0,  RoundRectIterator.acv,
               0.0,  0.0,  0.0,  0.5 ],
            [],
        ];
        static readonly types   : number[]   = [
            geom.SegmentType.MOVE_TO,
            geom.SegmentType.LINE_TO, geom.SegmentType.CURVE_TO,
            geom.SegmentType.LINE_TO, geom.SegmentType.CURVE_TO,
            geom.SegmentType.LINE_TO, geom.SegmentType.CURVE_TO,
            geom.SegmentType.LINE_TO, geom.SegmentType.CURVE_TO,
            geom.SegmentType.CLOSE,
        ];


        constructor(rr : geom.RoundRectangle2D, tx : geom.transform.BaseTransform) {
            this.x  = rr.x;
            this.y  = rr.y;
            this.w  = rr.width;
            this.h  = rr.height;
            this.aw = Math.min(this.w, Math.abs(rr.arcWidth));
            this.ah = Math.min(this.h, Math.abs(rr.arcHeight));
            this.transform = tx;
            if (this.aw < 0 || this.ah < 0) {
                this.index = RoundRectIterator.ctrlpts.length;
            }
        }


        getWindingRule(): geom.WindingRule;
        getWindingRule(): number;
        getWindingRule(): any {
            return geom.WindingRule.WIND_NON_ZERO
        }

        isDone(): boolean {
            return this.index >= RoundRectIterator.ctrlpts.length;
        }

        next(): void {
            ++this.index;
            if (this.index < RoundRectIterator.ctrlpts.length && this.aw == 0 && this.ah == 0 && RoundRectIterator.types[this.index] == geom.SegmentType.CURVE_TO) {
                this.index++;
            }
        }

        currentSegment(coords: number[]): number {
            if (this.isDone()) {
                throw new SyntaxError("roundrect iterator out of bounds");
            }
            let ctrls : number[] = RoundRectIterator.ctrlpts[this.index];
            let nc    : number = 0;
            for (let i : number = 0; i < ctrls.length; i += 4) {
                coords[nc++] = (this.x + ctrls[i + 0] * this.w + ctrls[i + 1] * this.aw);
                coords[nc++] = (this.y + ctrls[i + 2] * this.h + ctrls[i + 3] * this.ah);
            }
            if (transform != null) {
                transform.transform(coords, 0, coords, 0, nc / 2);
            }
            return RoundRectIterator.types[this.index];
        }

    }
}