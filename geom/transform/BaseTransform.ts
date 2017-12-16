import {Identity} from "./Identity";
import {Translate2D} from "./Translate2D";
import Point2D = geom.Point2D;
import {BaseBounds} from "../BaseBounds";
import Rectangle = geom.Rectangle;
import Shape = geom.Shape;

export enum Degree {
    IDENTITY,
    TRANSLATE_2D,
    AFFINE_2D
}

export abstract class BaseTransform {
    static readonly IDENTITY_TRANSFORM : BaseTransform = new Identity();
    static readonly EPSILON_ABSOLUTE       : number = 1.0e-5;
    static readonly TYPE_UNKNOWN           : number = -1;
    static readonly TYPE_IDENTITY          : number = 0;
    static readonly TYPE_TRANSLATION       : number = 1;
    static readonly TYPE_UNIFORM_SCALE     : number = 2;
    static readonly TYPE_GENERAL_SCALE     : number = 4;
    static readonly TYPE_MASK_SCALE        : number = (BaseTransform.TYPE_UNIFORM_SCALE | BaseTransform.TYPE_GENERAL_SCALE);
    static readonly TYPE_FLIP              : number = 64;
    static readonly TYPE_QUADRANT_ROTATION : number = 8;
    static readonly TYPE_GENERAL_ROTATION  : number = 16;
    static readonly TYPE_MASK_ROTATION     : number = (BaseTransform.TYPE_QUADRANT_ROTATION | BaseTransform.TYPE_GENERAL_ROTATION);
    static readonly TYPE_GENERAL_TRANSFORM : number = 32;
    static readonly TYPE_AFFINE2D_MASK     : number =
        (BaseTransform.TYPE_TRANSLATION |
         BaseTransform.TYPE_UNIFORM_SCALE |
         BaseTransform.TYPE_GENERAL_SCALE |
         BaseTransform.TYPE_QUADRANT_ROTATION |
         BaseTransform.TYPE_GENERAL_ROTATION |
         BaseTransform.TYPE_GENERAL_TRANSFORM |
         BaseTransform.TYPE_FLIP);

    degreeError(maxSupported : Degree) : void {
        throw new SyntaxError("does not support higher than "+maxSupported+" operations");
    }

    static getInstance(tx? : BaseTransform,
                       mxx? : number, mxy? : number, mxt? : number,
                       myx? : number, myy? : number, myt? : number) : BaseTransform {
        if (tx === undefined) {
            if (mxx == 1.0 && myx == 0.0 && mxy == 0.0 && myy == 1.0) {
                return BaseTransform.getTranslateInstance(mxt, myt);
            } else {
                return new Affine2D(mxx, myx, mxy, myy, mxt, myt);
            }
        } else {
            if (tx.isIdentity()) {
                return this.IDENTITY_TRANSFORM;
            } else if (tx.isTranslateOrIdentity()) {
                return new Translate2D(tx);
            } else {
                return new Affine2D(tx);
            }
        }
    }

    getInstance(mxx : number, myx : number, mxy : number, myy : number, mxt : number, myt : number) : BaseTransform {
        if (mxx == 1.0 && myx == 0.0 && mxy == 0.0 && myy == 1.0) {
            return BaseTransform.getTranslateInstance(mxt, myt);
        } else {
            return new Affine2D(mxx, myx, mxy, myy, mxt, myt);
        }
    }

    static getTranslateInstance(mxt : number, myt : number) : BaseTransform {
        if (mxt == 0.0 && myt == 0.0) {
            return BaseTransform.IDENTITY_TRANSFORM;
        } else {
            return new Translate2D(mxt, myt);
        }
    }

    static getScaleInstance(mxx : number, myy : number) : BaseTransform{
        return BaseTransform.getInstance(mxx, 0, 0, myy, 0, 0);
    }

    static getRotateInstance(theta : number, x : number, y : number) : BaseTransform{
        let a : Affine2D = new Affine2D();
        a.setToRotation(theta, x, y);
        return a;
    }

    abstract getDegree() : Degree;
    abstract getType() : number;

    abstract isIdentity() : boolean;
    abstract isTranslateOrIdentity() : boolean;
    abstract is2D() : boolean;

    abstract getDeterminant() : number;

    getMxx() : number { return 1.0; }
    getMxy() : number { return 0.0; }
    getMxz() : number { return 0.0; }
    getMxt() : number { return 0.0; }
    getMyx() : number { return 0.0; }
    getMyy() : number { return 1.0; }
    getMyz() : number { return 0.0; }
    getMyt() : number { return 0.0; }
    getMzx() : number { return 0.0; }
    getMzy() : number { return 0.0; }
    getMzz() : number { return 1.0; }
    getMzt() : number { return 0.0; }

    abstract transform(src : Point2D, dst : Point2D) : Point2D;
    abstract transform(srcPts : number[], srcOff : number,dstPts : number[], dstOff : number,numPts : number) : void;
    abstract transform(srcPts : number[], srcOff : number,dstPts : number[], dstOff : number,numPts : number) : void;
    abstract transform(srcPts : number[], srcOff : number,dstPts : number[], dstOff : number,numPts : number) : void;
    abstract transform(srcPts : number[], srcOff : number,dstPts : number[], dstOff : number,numPts : number) : void;
    abstract transform(bounds : BaseBounds, result : BaseBounds) : BaseBounds;
    abstract transform(rect : geom.Rectangle, result : Rectangle) : void;
    abstract deltaTransform(srcPts : number[], srcOff : number,dstPts : number[], dstOff : number,numPts : number) : void;
    abstract deltaTransform(srcPts : number[], srcOff : number,dstPts : number[], dstOff : number,numPts : number) : void;
    abstract inverseDeltaTransform(srcPts : number[], srcOff : number,dstPts : number[], dstOff : number,numPts : number) : void;
    abstract inverseTransform(src : Point2D, dst : Point2D) : Point2D;
    abstract inverseTransform(srcPts : number[], srcOff : number,dstPts : number[], dstOff : number,numPts : number) : void;
    abstract inverseTransform(srcPts : number[], srcOff : number,dstPts : number[], dstOff : number,numPts : number) : void;
    abstract inverseTransform(bounds : BaseBounds, result : BaseBounds) : BaseBounds;
    abstract inverseTransform(rect : Rectangle, result : Rectangle) : void;

    abstract createTransformedShape(s : Shape) : Shape;

    public abstract setToIdentity();
    public abstract setTransform(xform : BaseTransform) : void;

    abstract invert() : void;

    abstract restoreTransform(mxx : number, myx : number, mxy : number, myy : number, mxt : number, myt : number) : void;
    abstract restoreTransform(mxx : number, mxy : number, mxt : number, myx : number, myy : number, myt : number) : void;

    abstract deriveWithTranslation(mxt : number, myt : number) : BaseTransform;
    abstract deriveWithTranslation(mxt : number, myt : number, mzt : number) : BaseTransform;
    abstract deriveWithScale(mxx : number, myy : number, mzz : number) : BaseTransform;
    abstract deriveWithRotation(theta : number, axisX : number, axisY : number, axisZ : number) : BaseTransform;
    abstract deriveWithPreTranslation(mxt : number, myt : number) : BaseTransform;
    abstract deriveWithPreConcatenation(transform : BaseTransform) : BaseTransform;
    abstract deriveWithConcatenation(mxx : number, myx : number, mxy : number, myy : number, mxt : number, myt : number) : BaseTransform;
    abstract deriveWithConcatenation(tx : BaseTransform) : BaseTransform;
    abstract deriveWithNewTransform(tx : BaseTransform) : BaseTransform;

    abstract createInverse() : BaseTransform;

    abstract copy() : BaseTransform;

    static makePoint(src : Point2D, dst : Point2D) : Point2D {
        if (dst == null) {
            dst = new Point2D();
        }
        return dst;
    }

    static almostZero(a : number) : boolean {
        return ((a < BaseTransform.EPSILON_ABSOLUTE) && (a > -BaseTransform.EPSILON_ABSOLUTE));
    }
}