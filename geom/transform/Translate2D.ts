import BaseTransform = geom.transform.BaseTransform;
import Degree = geom.transform.Degree;
import Point2D = geom.Point2D;
import {BaseBounds} from "../BaseBounds";
import Rectangle = geom.Rectangle;

export class Translate2D extends BaseTransform {

    private mxt : number;
    private myt :  number;


    static getInstance(mxt : number, myt : number) : BaseTransform {
        if (mxt == 0.0 && myt == 0.0) {
            return BaseTransform.IDENTITY_TRANSFORM;
        } else {
            return new Translate2D(mxt, myt);
        }
    }


    constructor(tx : number, ty : number);
    constructor(tx : BaseTransform);
    constructor(tx? : number | BaseTransform, ty? : number,) {
        super();
        if (tx instanceof BaseTransform) {
            if (!tx.isTranslateOrIdentity()) {
                this.degreeError(Degree.TRANSLATE_2D);
            }
            this.mxt = tx.getMxt();
            this.myt = tx.getMyt();
        } else {
            this.mxt = tx;
            this.myt = ty;
        }
    }


    getMxt() : number{
        return this.mxt;
    }

    getMyt() : number {
        return this.myt;
    }

    getDegree(): Degree {
        return Degree.TRANSLATE_2D;
    }

    getType(): number {
        return (this.mxt == 0.0 && this.myt == 0.0) ? BaseTransform.TYPE_IDENTITY : BaseTransform.TYPE_TRANSLATION;
    }

    isIdentity(): boolean {
        return (this.mxt == 0.0 && this.myt == 0.0);
    }

    isTranslateOrIdentity(): boolean {
        return true;
    }

    is2D(): boolean {
        return true;
    }

    getDeterminant(): number {
        return undefined;
    }

    transform(src: Point2D, dst: Point2D): Point2D;
    transform(srcPts: number[], srcOff: number, dstPts: number[], dstOff: number, numPts: number): void;
    transform(bounds: BaseBounds, result: BaseBounds): BaseBounds;
    transform(rect: Rectangle, result: Rectangle): void;
    transform(src, dst, dstPts?: number[], dstOff?: number, numPts?: number): any {
        let tx : number = this.mxt;
        let ty : number = this.myt;
        if (dstPts == srcPts) {
            if (dstOff > srcOff && dstOff < srcOff + numPts * 2) {
                dstPts = srcPts.slice();
                //System.arraycopy(srcPts, srcOff, dstPts, dstOff, numPts * 2);
                srcOff = dstOff;
            }
            if (dstOff == srcOff && tx == 0.0 && ty == 0.0) {
                return;
            }
        }
        for (let i : number  = 0; i < numPts; i++) {
            dstPts[dstOff++] = srcPts[srcOff++] + tx;
            dstPts[dstOff++] = srcPts[srcOff++] + ty;
        }
    }

    deltaTransform(srcPts: number[], srcOff: number, dstPts: number[], dstOff: number, numPts: number): void {
    }

    inverseDeltaTransform(srcPts: number[], srcOff: number, dstPts: number[], dstOff: number, numPts: number): void {
    }

    inverseTransform(src: Point2D, dst: Point2D): Point2D;
    inverseTransform(srcPts: number[], srcOff: number, dstPts: number[], dstOff: number, numPts: number): void;
    inverseTransform(bounds: BaseBounds, result: BaseBounds): BaseBounds;
    inverseTransform(rect: geom.Rectangle, result: geom.Rectangle): void;
    inverseTransform(src, dst, dstPts?: number[], dstOff?: number, numPts?: number): any {
    }

    createTransformedShape(s: geom.Shape): geom.Shape {
        return new Path2D(s, this);
    }

    setToIdentity() {
        this.mxt = this.myt = 0.0;
    }

    setTransform(xform: BaseTransform): void {
        if (!xform.isTranslateOrIdentity()) {
            this.degreeError(Degree.TRANSLATE_2D);
        }
        this.mxt = xform.getMxt();
        this.myt = xform.getMyt();
    }

    invert(): void {
        this.mxt = -this.mxt;
        this.myt = -this.myt;
    }

    restoreTransform(mxx: number, myx: number, mxy: number, myy: number, mxt: number, myt: number): void {
        if (mxx != 1.0 || myx != 0.0 || mxy != 0.0 || myy != 1.0) {
            this.degreeError(Degree.TRANSLATE_2D);
        }
        this.mxt = mxt;
        this.myt = myt;
    }

    deriveWithTranslation(mxt: number, myt: number): BaseTransform;
    deriveWithTranslation(mxt: number, myt: number, mzt: number): BaseTransform;
    deriveWithTranslation(mxt: number, myt: number, mzt?: number): BaseTransform {
        return undefined;
    }

    deriveWithScale(mxx: number, myy: number, mzz: number): BaseTransform {
        return undefined;
    }

    deriveWithRotation(theta: number, axisX: number, axisY: number, axisZ: number): BaseTransform {
        return undefined;
    }

    deriveWithPreTranslation(mxt: number, myt: number): BaseTransform {
        return undefined;
    }

    deriveWithPreConcatenation(transform: BaseTransform): BaseTransform {
        return undefined;
    }

    deriveWithConcatenation(mxx: number, myx: number, mxy: number, myy: number, mxt: number, myt: number): BaseTransform;
    deriveWithConcatenation(tx: BaseTransform): BaseTransform;
    deriveWithConcatenation(mxx, myx?: number, mxy?: number, myy?: number, mxt?: number, myt?: number): BaseTransform {
        return undefined;
    }

    deriveWithNewTransform(tx: BaseTransform): BaseTransform {
        return undefined;
    }

    createInverse(): BaseTransform {
        return undefined;
    }

    copy(): BaseTransform {
        return undefined;
    }

}