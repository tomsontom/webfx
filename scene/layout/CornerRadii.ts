export class CornerRadii {
    public static readonly EMPTY : CornerRadii = new CornerRadii(0, 0, 0, 0, 0, 0, 0, 0, false, false, false, false, false, false, false, false);

    topLeftHorizontalRadius     : number;
    topLeftVerticalRadius       : number;
    topRightVerticalRadius      : number;
    topRightHorizontalRadius    : number;
    bottomRightHorizontalRadius : number;
    bottomRightVerticalRadius   : number;
    bottomLeftVerticalRadius    : number;
    bottomLeftHorizontalRadius  : number;

    topLeftHorizontalRadiusAsPercentage     : boolean;
    topLeftVerticalRadiusAsPercentage       : boolean;
    topRightVerticalRadiusAsPercentage      : boolean;
    topRightHorizontalRadiusAsPercentage    : boolean;
    bottomRightHorizontalRadiusAsPercentage : boolean;
    bottomRightVerticalRadiusAsPercentage   : boolean;
    bottomLeftVerticalRadiusAsPercentage    : boolean;
    bottomLeftHorizontalRadiusAsPercentage  : boolean;


    constructor(radius: number);
    constructor(topLeftHorizontalRadius : number, topLeftVerticalRadius : number, topRightVerticalRadius : number, topRightHorizontalRadius : number,
                bottomRightHorizontalRadius : number, bottomRightVerticalRadius : number, bottomLeftVerticalRadius : number, bottomLeftHorizontalRadius : number,
                topLeftHorizontalRadiusAsPercent : boolean, topLeftVerticalRadiusAsPercent : boolean, topRightVerticalRadiusAsPercent : boolean,
                topRightHorizontalRadiusAsPercent : boolean, bottomRightHorizontalRadiusAsPercent : boolean, bottomRightVerticalRadiusAsPercent : boolean,
                bottomLeftVerticalRadiusAsPercent : boolean, bottomLeftHorizontalRadiusAsPercent : boolean)
    constructor(topLeftHorizontalRadius? : number, topLeftVerticalRadius? : number, topRightVerticalRadius? : number, topRightHorizontalRadius? : number,
                bottomRightHorizontalRadius? : number, bottomRightVerticalRadius? : number, bottomLeftVerticalRadius? : number, bottomLeftHorizontalRadius? : number,
                topLeftHorizontalRadiusAsPercent? : boolean, topLeftVerticalRadiusAsPercent? : boolean, topRightVerticalRadiusAsPercent? : boolean,
                topRightHorizontalRadiusAsPercent? : boolean, bottomRightHorizontalRadiusAsPercent? : boolean, bottomRightVerticalRadiusAsPercent? : boolean,
                bottomLeftVerticalRadiusAsPercent? : boolean, bottomLeftHorizontalRadiusAsPercent? : boolean) {
        this.topLeftHorizontalRadius     = topLeftHorizontalRadius;
        this.topLeftVerticalRadius       = topLeftVerticalRadius;
        this.topRightVerticalRadius      = topRightVerticalRadius;
        this.topRightHorizontalRadius    = topRightHorizontalRadius;
        this.bottomRightHorizontalRadius = bottomRightHorizontalRadius;
        this.bottomRightVerticalRadius   = bottomRightVerticalRadius;
        this.bottomLeftVerticalRadius    = bottomLeftVerticalRadius;
        this.bottomLeftHorizontalRadius  = bottomLeftHorizontalRadius;

        this.topLeftHorizontalRadiusAsPercentage     = topLeftHorizontalRadiusAsPercent;
        this.topLeftVerticalRadiusAsPercentage       = topLeftVerticalRadiusAsPercent;
        this.topRightVerticalRadiusAsPercentage      = topRightVerticalRadiusAsPercent;
        this.topRightHorizontalRadiusAsPercentage    = topRightHorizontalRadiusAsPercent;
        this.bottomRightHorizontalRadiusAsPercentage = bottomRightHorizontalRadiusAsPercent;
        this.bottomRightVerticalRadiusAsPercentage   = bottomRightVerticalRadiusAsPercent;
        this.bottomLeftVerticalRadiusAsPercentage    = bottomLeftVerticalRadiusAsPercent;
        this.bottomLeftHorizontalRadiusAsPercentage  = bottomLeftHorizontalRadiusAsPercent;
    }
}