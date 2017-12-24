export class MatrixType {
    public static readonly MT_2D_2x3 : MatrixType = new MatrixType(2, 3);
    public static readonly MT_2D_3x3 : MatrixType = new MatrixType(3, 3);
    public static readonly MT_3D_3x4 : MatrixType = new MatrixType(3, 4);
    public static readonly MT_3D_4x4 : MatrixType = new MatrixType(4, 4);

    private readonly r : number;
    private readonly c : number;


    private constructor(rows : number, cols : number) {
        this.r = rows;
        this.c = cols;
    }

    elements() : number {
        return this.r * this.c;
    }

    rows() : number {
        return this.r;
    }

    columns() : number {
        return this.c;
    }

    public is2D() : boolean {
        return this == MatrixType.MT_2D_2x3 || this == MatrixType.MT_2D_3x3;
    }
}