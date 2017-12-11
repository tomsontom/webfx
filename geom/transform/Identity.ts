namespace geom.transform {
    export class Identity extends BaseTransform {


        getDegree(): geom.transform.Degree {
            return Degree.IDENTITY;
        }

        getType(): number {
            return Identity.TYPE_IDENTITY;
        }

        isIdentity(): boolean {
            return true;
        }

        isTranslateOrIdentity(): boolean {
            return true;
        }

        is2D(): boolean {
            return true;
        }

        getDeterminant(): number {
            return 1.0;
        }

        transform(src: geom.Point2D, dst: geom.Point2D): geom.Point2D;
        transform(srcPts: number[], srcOff: number, dstPts: number[], dstOff: number, numPts: number): void;
        transform(bounds: geom.BaseBounds, result: geom.BaseBounds): geom.BaseBounds;
        transform(rect: geom.Rectangle, result: geom.Rectangle): void;
        transform(src, dst, dstPts?: number[], dstOff?: number, numPts?: number): any {
            if (dst == null) dst = BaseTransform.makePoint(src, dst);
            dst.setLocation(src);
            return dst;
        }

        deltaTransform(srcPts: number[], srcOff: number, dstPts: number[], dstOff: number, numPts: number): void {

        }

        inverseDeltaTransform(srcPts: number[], srcOff: number, dstPts: number[], dstOff: number, numPts: number): void {
        }

        inverseTransform(src: geom.Point2D, dst: geom.Point2D): geom.Point2D;
        inverseTransform(srcPts: number[], srcOff: number, dstPts: number[], dstOff: number, numPts: number): void;
        inverseTransform(bounds: geom.BaseBounds, result: geom.BaseBounds): geom.BaseBounds;
        inverseTransform(rect: geom.Rectangle, result: geom.Rectangle): void;
        inverseTransform(src, dst, dstPts?: number[], dstOff?: number, numPts?: number): any {
            if (dst == null) dst = BaseTransform.makePoint(src, dst);
            dst.setLocation(src);
            return dst;
        }

        createTransformedShape(s: geom.Shape): geom.Shape {
            return new Path2D(s);
        }

        setToIdentity() {
        }

        setTransform(xform: geom.transform.BaseTransform): void {
            if (!xform.isIdentity()) {
                this.degreeError(Degree.IDENTITY);
            }
        }

        invert(): void {
        }

        restoreTransform(mxx: number, myx: number, mxy: number, myy: number, mxt: number, myt: number): void {
            if (mxx != 1.0 || myx != 0.0 || mxy != 0.0 || myy != 1.0 || mxt != 0.0 || myt != 0.0) {
                this.degreeError(Degree.IDENTITY);
            }
        }

        deriveWithTranslation(mxt: number, myt: number): geom.transform.BaseTransform;
        deriveWithTranslation(mxt: number, myt: number, mzt: number): geom.transform.BaseTransform;
        deriveWithTranslation(mxt: number, myt: number, mzt?: number): geom.transform.BaseTransform {
            return geom.transform.Translate2D.getInstance(mxt, myt);
        }

        deriveWithScale(mxx: number, myy: number): geom.transform.BaseTransform {
            if (mxx == 1.0 && myy == 1.0) {
                return this;
            }
            let a : Affine2D = new geom.transform.Affine2D();
            a.scale(mxx, myy);
            return a;
        }

        deriveWithRotation(theta: number, axisX: number, axisY: number): geom.transform.BaseTransform {
            if (theta == 0.0) {
                return this;
            }
            if (BaseTransform.almostZero(axisX) && BaseTransform.almostZero(axisY)) {
                let a = new geom.transform.Affine2D();
                return a;
            }
        }

        deriveWithPreTranslation(mxt: number, myt: number): geom.transform.BaseTransform {
            return geom.transform.Translate2D.getInstance(mxt, myt);
        }

        deriveWithPreConcatenation(transform: geom.transform.BaseTransform): geom.transform.BaseTransform {
            return undefined;
        }

        deriveWithConcatenation(mxx: number, myx: number, mxy: number, myy: number, mxt: number, myt: number): geom.transform.BaseTransform;
        deriveWithConcatenation(tx: geom.transform.BaseTransform): geom.transform.BaseTransform;
        deriveWithConcatenation(mxx, myx?: number, mxy?: number, myy?: number, mxt?: number, myt?: number): geom.transform.BaseTransform {
            return BaseTransform.getInstance(mxx, myx, mxy, myy, mxt, myt);
        }

        deriveWithNewTransform(tx: geom.transform.BaseTransform): geom.transform.BaseTransform {
            return BaseTransform.getInstance(tx);
        }

        createInverse(): geom.transform.BaseTransform {
            return undefined;
        }

        copy(): geom.transform.BaseTransform {
            return undefined;
        }

    }
}