namespace geom.transform {

    export enum Degree {
        IDENTITY,
        TRANSLATE_2D,
        AFFINE_2D
    }

    export abstract class BaseTransform {
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

        static getInstance(mxx : number, mxy : number, mxt : number,
                           myx : number, myy : number, myt : number) : BaseTransform {
                return BaseTransform.getInstance(mxx, myx, mxy, myy, mxt, myt);
        }

        getInstance(mxx : number, myx : number, mxy : number, myy : number, mxt : number, myt : number) : BaseTransform {
            if (mxx == 1.0 && myx == 0.0 && mxy == 0.0 && myy == 1.0) {
                return getTranslateInstance(mxt, myt);
            } else {
                return new geom.transform.Affine2D(mxx, myx, mxy, myy, mxt, myt);
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
            let a : geom.transform.Affine2D = new geom.transform.Affine2D();
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

        abstract transform(src : Point2D, dst : Point2D) : geom.Point2D;
        abstract inverseTransform(src : Point2D, dst : Point2D) : geom.Point2D;

        abstract transform(srcPts : number[], srcOff : number,dstPts : number[], dstOff : number,numPts : number) : void;
        abstract transform(srcPts : number[], srcOff : number,dstPts : number[], dstOff : number,numPts : number) : void;
        abstract transform(srcPts : number[], srcOff : number,dstPts : number[], dstOff : number,numPts : number) : void;
        abstract transform(srcPts : number[], srcOff : number,dstPts : number[], dstOff : number,numPts : number) : void;
        abstract deltaTransform(srcPts : number[], srcOff : number,dstPts : number[], dstOff : number,numPts : number) : void;
        abstract deltaTransform(srcPts : number[], srcOff : number,dstPts : number[], dstOff : number,numPts : number) : void;
        abstract inverseTransform(srcPts : number[], srcOff : number,dstPts : number[], dstOff : number,numPts : number) : void;
        abstract inverseDeltaTransform(srcPts : number[], srcOff : number,dstPts : number[], dstOff : number,numPts : number) : void;
        abstract inverseTransform(srcPts : number[], srcOff : number,dstPts : number[], dstOff : number,numPts : number) : void;

        abstract transform(bounds : BaseBounds, result : BaseBounds) : BaseBounds;
        abstract transform(rect : geom.Rectangle, result : geom.Rectangle) : void;
        abstract inverseTransform(bounds : BaseBounds, result : BaseBounds) : BaseBounds;
        abstract inverseTransform(rect : Rectangle, result : geom.Rectangle) : void;

        abstract createTransformedShape(s : geom.Shape) : geom.Shape;

        public abstract setToIdentity();
        public abstract setTransform(xform : BaseTransform) : void;

        abstract invert() : void;

        abstract restoreTransform(double mxx, double myx, double mxy, double myy, double mxt, double myt) : void;

        abstract void restoreTransform(double mxx, double mxy, double mxz, double mxt, double myx, double myy, double myz, double myt, double mzx, double mzy, double mzz, double mzt);

        abstract BaseTransform deriveWithTranslation(double mxt, double myt);
        abstract BaseTransform deriveWithTranslation(double mxt, double myt, double mzt);
        abstract BaseTransform deriveWithScale(double mxx, double myy, double mzz);
        abstract BaseTransform deriveWithRotation(double theta, double axisX, double axisY, double axisZ);
        abstract BaseTransform deriveWithPreTranslation(double mxt, double myt);
        abstract BaseTransform deriveWithConcatenation(double mxx, double myx, double mxy, double myy, double mxt, double myt);
        abstract BaseTransform deriveWithConcatenation(double mxx, double mxy, double mxz, double mxt, double myx, double myy, double myz, double myt, double mzx, double mzy, double mzz, double mzt);
        abstract BaseTransform deriveWithPreConcatenation(BaseTransform transform);
        abstract BaseTransform deriveWithConcatenation(BaseTransform tx);
        abstract BaseTransform deriveWithNewTransform(BaseTransform tx);

        abstract BaseTransform createInverse() throws NoninvertibleTransformException;

        abstract BaseTransform copy();


        static geom.Point2D makePoint(Point2D src, Point2D dst) {
            if (dst == null) {
                dst = new Point2D();
            }
            return dst;
        }

        static readonly EPSILON_ABSOLUTE : number = 1.0e-5;

        public static boolean almostZero(double a) {
            return ((a < EPSILON_ABSOLUTE) && (a > -EPSILON_ABSOLUTE));
        }
    }
}