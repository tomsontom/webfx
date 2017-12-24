import {Transform} from "./Transform";
import {MatrixType} from "./MatrixType";

export class Affine extends Transform {
    private static readonly APPLY_IDENTITY   : number = 0;
    private static readonly APPLY_TRANSLATE  : number = 1;
    private static readonly APPLY_SCALE      : number = 2;
    private static readonly APPLY_SHEAR      : number = 4;
    private static readonly APPLY_NON_3D     : number = 0;
    private static readonly APPLY_3D_COMPLEX : number = 4;

    private state2d : number;
    private state3d : number;
    private xx      : number;
    private xy      : number;
    private xz      : number;
    private yx      : number;
    private yy      : number;
    private yz      : number;
    private zx      : number;
    private zy      : number;
    private zz      : number;
    private xt      : number;
    private yt      : number;
    private zt      : number;


    constructor();
    constructor(mxx : number, mxy : number, tx : number,
                myx : number, myy : number, ty : number);
    constructor(mxx : number, mxy : number, mxz : number, tx : number,
                myx : number, myy : number, myz : number, ty : number,
                mzx : number, mzy : number, mzz : number, tz : number);
    constructor(mxx? : number, mxy? : number, mxz? : number, tx? : number,
                myx? : number, myy? : number, myz? : number, ty? : number,
                mzx? : number, mzy? : number, mzz? : number, tz? : number) {
        super();

        this.xx = mxx;
        this.xy = mxy;
        this.xz = mxz;

        this.yx = myx;
        this.yy = myy;
        this.yz = myz;
        this.yt = ty;

        this.zx = mzx;
        this.zy = mzy;
        this.zz = mzz;
        this.zt = tz;

        this.updateState();
    }

    getMxx() : number {
        return this.xx;
    }
    setMxx(value : number) : void {
        this.xx = value;
        this.postProcessChange();
    }

    getMxy() : number {
        return this.xy;
    }
    setMxy(value : number) : void {
        this.xy = value;
        this.postProcessChange();
    }

    getMxz() : number {
        return this.xz;
    }
    setMxz(value : number) : void {
        this.xz = value;
        this.postProcessChange();
    }

    getTx() : number {
        return this.xt;
    }
    setTx(value : number) : void {
        this.xt = value;
        this.postProcessChange();
    }

    getMyx() : number {
        return this.yx;
    }
    setMyx(value : number) : void {
        this.yx = value;
        this.postProcessChange();
    }

    getMyy() : number {
        return this.yy;
    }
    setMyy(value : number) : void {
        this.yy = value;
        this.postProcessChange();
    }

    getMyz() : number {
        return this.yz;
    }
    setMyz(value : number) : void {
        this.yz = value;
        this.postProcessChange();
    }

    getTy() : number {
        return this.yt;
    }
    setTy(value : number) : void {
        this.yt = value;
        this.postProcessChange();
    }

    getMzx() : number {
        return this.zx;
    }
    setMzx(value : number) : void {
        this.zx = value;
        this.postProcessChange();
    }

    getMzy() : number {
        return this.zy;
    }
    setMzy(value : number) : void {
        this.zy = value;
        this.postProcessChange();
    }

    getMzz() : number {
        return this.zz;
    }
    setMzz(value : number) : void {
        this.zz = value;
        this.postProcessChange();
    }

    getTz() : number {
        return this.zt;
    }
    setTz(value : number) : void {
        this.zt = value;
        this.postProcessChange();
    }

    setElement(type : MatrixType, row : number, column : number, value : number) : void {
        if (row < 0 || row >= type.rows() ||
            column < 0 || column >= type.columns()) {
            throw new SyntaxError("Index outside of affine matrix " + type + ": [" + row + ", " + column + "]");
        }
        switch(type) {
            case MatrixType.MT_2D_2x3:

                // Fall through
            case MatrixType.MT_2D_3x3:
                if (!isType2D()) { throw new SyntaxError("Cannot access 2D matrix of a 3D transform"); }
                switch(row) {
                    case 0:
                        switch(column) {
                            case 0: this.setMxx(value); return;
                            case 1: this.setMxy(value); return;
                            case 2: this.setTx(value); return;
                        }
                    case 1:
                        switch(column) {
                            case 0: this.setMyx(value); return;
                            case 1: this.setMyy(value); return;
                            case 2: this.setTy(value); return;
                        }
                    case 2:
                        switch(column) {
                            case 0: if (value == 0.0) return; else break;
                            case 1: if (value == 0.0) return; else break;
                            case 2: if (value == 1.0) return; else break;
                        }
                }
                break;
            case MatrixType.MT_3D_3x4:

                // Fall through
            case MatrixType.MT_3D_4x4:
                switch(row) {
                    case 0:
                        switch(column) {
                            case 0: this.setMxx(value); return;
                            case 1: this.setMxy(value); return;
                            case 2: this.setMxz(value); return;
                            case 3: this.setTx(value); return;
                        }
                    case 1:
                        switch(column) {
                            case 0: this.setMyx(value); return;
                            case 1: this.setMyy(value); return;
                            case 2: this.setMyz(value); return;
                            case 3: this.setTy(value); return;
                        }
                    case 2:
                        switch(column) {
                            case 0: this.setMzx(value); return;
                            case 1: this.setMzy(value); return;
                            case 2: this.setMzz(value); return;
                            case 3: this.setTz(value); return;
                        }
                    case 3:
                        switch(column) {
                            case 0: if (value == 0.0) return; else break;
                            case 1: if (value == 0.0) return; else break;
                            case 2: if (value == 0.0) return; else break;
                            case 3: if (value == 1.0) return; else break;
                        }
                }
                break;
        }
    }

    postProcessChange() : void {
        this.updateState();
        this.transformChanged();
    }

    computeIs2D() : boolean {
        return (this.state3d == Affine.APPLY_NON_3D)
    }

    computeIsIdentity() : boolean {
        return this.state3d == Affine.APPLY_NON_3D && this.state2d == Affine.APPLY_IDENTITY;
    }

    determinant() : number {
        if (this.state3d == Affine.APPLY_NON_3D) {
            return this.getDeterminant2D();
        } else {
            return this.getDeterminant3D();
        }
    }

    getDeterminant2D() : number {
        switch (this.state2d) {
            case Affine.APPLY_SHEAR | Affine.APPLY_SCALE | Affine.APPLY_TRANSLATE:
            case Affine.APPLY_SHEAR | Affine.APPLY_SCALE:
                return this.getMxx() * this.getMyy() - this.getMxy() * this.getMyx();
            case Affine.APPLY_SHEAR | Affine.APPLY_TRANSLATE:
            case Affine.APPLY_SHEAR:
                return -(this.getMxy() * this.getMyx());
            case Affine.APPLY_SCALE | Affine.APPLY_TRANSLATE:
            case Affine.APPLY_SCALE:
                return this.getMxx() * this.getMyy();
            case Affine.APPLY_TRANSLATE:
            case Affine.APPLY_IDENTITY:
                return 1.0;
        }
    }

    getDeterminant3D() : number {
        switch(this.state3d) {
            case Affine.APPLY_TRANSLATE:
                return 1.0;
            case Affine.APPLY_SCALE:
            case Affine.APPLY_SCALE | Affine.APPLY_TRANSLATE:
                return this.getMxx() * this.getMyy() * this.getMzz();
            case Affine.APPLY_3D_COMPLEX:
                var myx : number = this.getMyx();
                var myy : number = this.getMyy();
                var myz : number = this.getMyz();
                var mzx : number = this.getMzx();
                var mzy : number = this.getMzy();
                var mzz : number = this.getMzz();

                return (this.getMxx() * (myy * mzz - mzy * myz) +
                        this.getMxy() * (myz * mzx - mzz * myx) +
                        this.getMxz() * (myx * mzy - mzx * myy));
        }
    }

    createConcatenation(transform : Transform) : Transform {
        var a : Affine = this.clone();
        a.append(transform);
        return a;
    }

    createInverse(transform : Transform) : Transform {
        var t : Affine = this.clone();
        t.invert();
        return t;
    }

    clone() : Affine {
        return new Affine(this.getMxx(), this.getMxy(), this.getMxz(), this.getTx(),
                          this.getMyx(), this.getMyy(), this.getMyz(), this.getTy(),
                          this.getMzx(), this.getMzy(), this.getMzz(), this.getTz());
    }

    setToTransform(transform : Transform);
    setToTransform(mxx : number, mxy : number, mxz : number, tx : number,
                   myx : number, myy : number, myz : number, ty : number);
    setToTransform(mxx : number, mxy : number, mxz : number, tx : number,
                   myx : number, myy : number, myz : number, ty : number,
                   mzx : number, mzy : number, mzz : number, tz : number);
    setToTransform(transform? : Transform,
                   mxx? : number, mxy? : number, mxz? : number, tx? : number,
                   myx? : number, myy? : number, myz? : number, ty? : number,
                   mzx? : number, mzy? : number, mzz? : number, tz? : number) : void {
            if (transform != null) {
                mxx = transform.getMxx();
                mxy = transform.getMxy();
                mxz = transform.getMxz();
                tx  = transform.getTx();
                myx = transform.getMyx();
                myy = transform.getMyy();
                myz = transform.getMyz();
                ty  = transform.getTy();
                mzx = transform.getMzx();
                mzy = transform.getMzy();
                mzz = transform.getMzz();
                tz  = transform.getTz();
                if(mzx == null && mzy == null && mzz == null && tz == null) {
                    mxz = 0;
                    myz = 0;
                    mzx = 0;
                    mzy = 0;
                    mzz = 1;
                    tz  = 0;
                }
            } else if(mzx == null && mzy == null && mzz == null && tz == null) {
                mxz = 0;
                myz = 0;
                mzx = 0;
                mzy = 0;
                mzz = 1;
                tz  = 0;
            }
            this.setMxx(mxx);
            this.setMxy(mxy);
            this.setMxz(mxz);
            this.setTx(tx);
            this.setMyx(myx);
            this.setMyy(myy);
            this.setMyz(myz);
            this.setTy(ty);
            this.setMzx(mzx);
            this.setMzy(mzy);
            this.setMzz(mzz);
            this.setTz(tz);

            this.updateState();
    };

    setToIdentity() : void {
        if (this.state3d != Affine.APPLY_NON_3D) {
            this.setMxx(1.0); this.setMxy(0.0); this.setMxz(0.0); this.setTx(0.0);
            this.setMyx(0.0); this.setMyy(1.0); this.setMyz(0.0); this.setTy(0.0);
            this.setMzx(0.0); this.setMzy(0.0); this.setMzz(1.0); this.setTz(0.0);
            this.state3d = Affine.APPLY_NON_3D;
            this.state2d = Affine.APPLY_IDENTITY;
        } else if (this.state2d != Affine.APPLY_IDENTITY) {
            this.setMxx(1.0); this.setMxy(0.0); this.setTx(0.0);
            this.setMyx(0.0); this.setMyy(1.0); this.setTy(0.0);
            this.state2d = Affine.APPLY_IDENTITY;
        }
    }

    invert() : void {
        if (this.state3d == Affine.APPLY_NON_3D) {
            this.invert2D();
            this.updateState2D();
        } else {
            this.invert3D();
            this.updateState();
        }
    }

    invert2D() : void {
        var Mxx : number;
        var Mxy : number;
        var Mxt : number;
        var Myx : number;
        var Myy : number;
        var Myt : number;
        var det : number;

        switch (this.state2d) {
            case Affine.APPLY_SHEAR | Affine.APPLY_SCALE | Affine.APPLY_TRANSLATE:
                Mxx = this.getMxx(); Mxy = this.getMxy(); Mxt = this.getTx();
                Myx = this.getMyx(); Myy = this.getMyy(); Myt = this.getTy();
                det = this.getDeterminant2D();
                if (det == 0.0) {
                    throw new SyntaxError("Determinant is 0");
                }
                this.setMxx(Myy / det);
                this.setMyx(-Myx / det);
                this.setMxy(-Mxy / det);
                this.setMyy(Mxx / det);
                this.setTx((Mxy * Myt - Myy * Mxt) / det);
                this.setTy((Myx * Mxt - Mxx * Myt) / det);
                return;
            case Affine.APPLY_SHEAR | Affine.APPLY_SCALE:
                Mxx = this.getMxx(); Mxy = this.getMxy();
                Myx = this.getMyx(); Myy = this.getMyy();
                det = this.getDeterminant2D();
                if (det == 0.0) {
                    throw new SyntaxError("Determinant is 0");
                }
                this.setMxx(Myy / det);
                this.setMyx(-Myx / det);
                this.setMxy(-Mxy / det);
                this.setMyy(Mxx / det);
                return;
            case Affine.APPLY_SHEAR | Affine.APPLY_TRANSLATE:
                Mxy = this.getMxy(); Mxt = this.getTx();
                Myx = this.getMyx(); Myt = this.getTy();
                if (Mxy == 0.0 || Myx == 0.0) {
                    throw new SyntaxError("Determinant is 0");
                }
                this.setMyx(1.0 / Mxy);
                this.setMxy(1.0 / Myx);
                this.setTx(-Myt / Myx);
                this.setTy(-Mxt / Mxy);
                return;
            case Affine.APPLY_SHEAR:
                Mxy = this.getMxy();
                Myx = this.getMyx();
                if (Mxy == 0.0 || Myx == 0.0) {
                    throw new SyntaxError("Determinant is 0");
                }
                this.setMyx(1.0 / Mxy);
                this.setMxy(1.0 / Myx);
                return;
            case Affine.APPLY_SCALE | Affine.APPLY_TRANSLATE:
                Mxx = this.getMxx(); Mxt = this.getTx();
                Myy = this.getMyy(); Myt = this.getTy();
                if (Mxx == 0.0 || Myy == 0.0) {
                    throw new SyntaxError("Determinant is 0");
                }
                this.setMxx(1.0 / Mxx);
                this.setMyy(1.0 / Myy);
                this.setTx(-Mxt / Mxx);
                this.setTy(-Myt / Myy);
                return;
            case Affine.APPLY_SCALE:
                Mxx = this.getMxx();
                Myy = this.getMyy();
                if (Mxx == 0.0 || Myy == 0.0) {
                    throw new SyntaxError("Determinant is 0");
                }
                this.setMxx(1.0 / Mxx);
                this.setMyy(1.0 / Myy);
                return;
            case Affine.APPLY_TRANSLATE:
                this.setTx(-this.getTx());
                this.setTy(-this.getTy());
                return;
            case Affine.APPLY_IDENTITY:
                return;
        }
    }

    invert3D() : void {
        switch(this.state3d) {
            case Affine.APPLY_TRANSLATE:
                this.setTx(-this.getTx());
                this.setTy(-this.getTy());
                this.setTz(-this.getTz());
                return;
            case Affine.APPLY_SCALE:
                var mxx_s : number = this.getMxx();
                var myy_s : number = this.getMyy();
                var mzz_s : number = this.getMzz();
                if (mxx_s == 0.0 || myy_s == 0.0 || mzz_s == 0.0) {
                    throw new SyntaxError("Determinant is 0");
                }
                this.setMxx(1.0 / mxx_s);
                this.setMyy(1.0 / myy_s);
                this.setMzz(1.0 / mzz_s);
                return;
            case Affine.APPLY_SCALE | Affine.APPLY_TRANSLATE:
                var mxx_st : number = this.getMxx();
                var tx_st  : number = this.getTx();
                var myy_st : number = this.getMyy();
                var ty_st  : number = this.getTy();
                var mzz_st : number = this.getMzz();
                var tz_st  : number = this.getTz();
                if (mxx_st == 0.0 || myy_st == 0.0 || mzz_st == 0.0) {
                    throw new SyntaxError("Determinant is 0");
                }
                this.setMxx(1.0 / mxx_st);
                this.setMyy(1.0 / myy_st);
                this.setMzz(1.0 / mzz_st);
                this.setTx(-tx_st / mxx_st);
                this.setTy(-ty_st / myy_st);
                this.setTz(-tz_st / mzz_st);
                return;
            case Affine.APPLY_3D_COMPLEX:

                // InvM = Transpose(Cofactor(M)) / det(M)
                // Cofactor(M) = matrix of cofactors(0..3,0..3)
                // cofactor(r,c) = (-1 if r+c is odd) * minor(r,c)
                // minor(r,c) = det(M with row r and col c removed)
                // For an Affine3D matrix, minor(r, 3) is {0, 0, 0, det}
                // which generates {0, 0, 0, 1} and so can be ignored.

                var mxx : number = this.getMxx();
                var mxy : number = this.getMxy();
                var mxz : number = this.getMxz();
                var tx  : number = this.getTx();
                var myx : number = this.getMyx();
                var myy : number = this.getMyy();
                var myz : number = this.getMyz();
                var ty  : number = this.getTy();
                var mzy : number = this.getMzy();
                var mzx : number = this.getMzx();
                var mzz : number = this.getMzz();
                var tz  : number = this.getTz();

                var det =
                mxx * (myy * mzz - mzy * myz) +
                mxy * (myz * mzx - mzz * myx) +
                mxz * (myx * mzy - mzx * myy);

                if (det == 0.0) {
                    throw new SyntaxError("Determinant is 0");
                }

                var cxx : number =   myy * mzz - myz * mzy;
                var cyx : number = - myx * mzz + myz * mzx;
                var czx : number =   myx * mzy - myy * mzx;
                var cxt : number = - mxy * (myz * tz - mzz  * ty)
                                   - mxz * (ty  * mzy - tz  * myy)
                                   - tx  * (myy * mzz - mzy * myz);
                var cxy : number = - mxy * mzz + mxz * mzy;
                var cyy : number =   mxx * mzz - mxz * mzx;
                var czy : number = - mxx * mzy + mxy * mzx;
                var cyt : number =   mxx * (myz * tz  - mzz * ty)
                                     + mxz * (ty  * mzx - tz  * myx)
                                     + tx  * (myx * mzz - mzx * myz);
                var cxz : number =   mxy * myz - mxz * myy;
                var cyz : number = - mxx * myz + mxz * myx;
                var czz : number =   mxx * myy - mxy * myx;
                var czt : number = - mxx * (myy * tz - mzy  * ty)
                                   - mxy * (ty  * mzx - tz  * myx)
                                   - tx  * (myx * mzy - mzx * myy);

                this.setMxx(cxx / det);
                this.setMxy(cxy / det);
                this.setMxz(cxz / det);
                this.setTx(cxt / det);
                this.setMyx(cyx / det);
                this.setMyy(cyy / det);
                this.setMyz(cyz / det);
                this.setTy(cyt / det);
                this.setMzx(czx / det);
                this.setMzy(czy / det);
                this.setMzz(czz / det);
                this.setTz(czt / det);
                return;
        }
    }

    append(transform : Transform) : void {
        transform.appendTo(this);
    }

}