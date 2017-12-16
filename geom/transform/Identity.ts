import BaseTransform = geom.transform.BaseTransform;
import Degree = geom.transform.Degree;
import Point2D = geom.Point2D;
import {BaseBounds} from "../BaseBounds";
import Rectangle = geom.Rectangle;
import Translate2D = geom.transform.Translate2D;

export class Identity extends BaseTransform {


    getDegree(): Degree {
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

    transform(src: Point2D, dst: Point2D): Point2D;
    transform(srcPts: number[], srcOff: number, dstPts: number[], dstOff: number, numPts: number): void;
    transform(bounds: BaseBounds, result: BaseBounds): BaseBounds;
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

    inverseTransform(src: Point2D, dst: Point2D): Point2D;
    inverseTransform(srcPts: number[], srcOff: number, dstPts: number[], dstOff: number, numPts: number): void;
    inverseTransform(bounds: BaseBounds, result: BaseBounds): BaseBounds;
    inverseTransform(rect: Rectangle, result: Rectangle): void;
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

    setTransform(xform: BaseTransform): void {
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

    deriveWithTranslation(mxt: number, myt: number): BaseTransform;
    deriveWithTranslation(mxt: number, myt: number, mzt: number): BaseTransform;
    deriveWithTranslation(mxt: number, myt: number, mzt?: number): BaseTransform {
        return geom.transform.Translate2D.getInstance(mxt, myt);
    }

    deriveWithScale(mxx: number, myy: number): BaseTransform {
        if (mxx == 1.0 && myy == 1.0) {
            return this;
        }
        let a : Affine2D = new Affine2D();
        a.scale(mxx, myy);
        return a;
    }

    deriveWithRotation(theta: number, axisX: number, axisY: number): BaseTransform {
        if (theta == 0.0) {
            return this;
        }
        if (BaseTransform.almostZero(axisX) && BaseTransform.almostZero(axisY)) {
            let a = new Affine2D();
            return a;
        }
    }

    deriveWithPreTranslation(mxt: number, myt: number): BaseTransform {
        return Translate2D.getInstance(mxt, myt);
    }

    deriveWithPreConcatenation(transform: BaseTransform): BaseTransform {
        return undefined;
    }

    deriveWithConcatenation(mxx: number, myx: number, mxy: number, myy: number, mxt: number, myt: number): BaseTransform;
    deriveWithConcatenation(tx: geom.transform.BaseTransform): BaseTransform;
    deriveWithConcatenation(mxx, myx?: number, mxy?: number, myy?: number, mxt?: number, myt?: number): BaseTransform {
        return BaseTransform.getInstance(mxx, myx, mxy, myy, mxt, myt);
    }

    deriveWithNewTransform(tx: BaseTransform): BaseTransform {
        return BaseTransform.getInstance(tx);
    }

    createInverse(): BaseTransform {
        return undefined;
    }

    copy(): BaseTransform {
        return undefined;
    }

}