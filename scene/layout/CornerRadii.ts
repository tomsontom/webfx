namespace scene.layout {
    export class CornerRadii {
        topLeftHorizontalRadius : number;
        topLeftVerticalRadius : number;
        topRightVerticalRadius : number;
        topRightHorizontalRadius : number;
        bottomRightHorizontalRadius : number;
        bottomRightVerticalRadius : number;
        bottomLeftVerticalRadius : number;
        bottomLeftHorizontalRadius : number;

        topLeftHorizontalRadiusAsPercentage : boolean;
        topLeftVerticalRadiusAsPercentage : boolean;
        topRightVerticalRadiusAsPercentage : boolean;
        topRightHorizontalRadiusAsPercentage : boolean;
        bottomRightHorizontalRadiusAsPercentage : boolean;
        bottomRightVerticalRadiusAsPercentage: boolean;
        bottomLeftVerticalRadiusAsPercentage : boolean;
        bottomLeftHorizontalRadiusAsPercentage : boolean;

        constructor(radius: number) {
            this.topLeftHorizontalRadius = radius;
            this.topLeftVerticalRadius = radius;
            this.topRightVerticalRadius = radius;
            this.topRightHorizontalRadius = radius;
            this.bottomRightHorizontalRadius = radius;
            this.bottomRightVerticalRadius = radius;
            this.bottomLeftVerticalRadius = radius;
            this.bottomLeftHorizontalRadius = radius;

            this.topLeftHorizontalRadiusAsPercentage = false;
            this.topLeftVerticalRadiusAsPercentage = false;
            this.topRightVerticalRadiusAsPercentage = false;
            this.topRightHorizontalRadiusAsPercentage = false;
            this.bottomRightHorizontalRadiusAsPercentage = false;
            this.bottomRightVerticalRadiusAsPercentage = false;
            this.bottomLeftVerticalRadiusAsPercentage = false;
            this.bottomLeftHorizontalRadiusAsPercentage = false;

        }
    }
}