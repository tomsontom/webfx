/// <reference path="./Paint.ts" />
/// <reference path="./Color.ts" />

namespace scene.paint {
    export class RadialGradient extends Paint {
        static count = 0;

        focusAngle    : number;
        focusDistance : number;
        centerX       : number;
        centerY       : number;
        radius        : number;
        proportional  : boolean;
        cycleMethod   : CycleMethod;
        stops         : Stop[];
        opaque        : boolean;
        id            : string;


        constructor();
        constructor(focusAngle : number, focusDistance : number, centerX : number, centerY : number,
                    radius : number, proportional : boolean, cycleMethod : CycleMethod, stops : Stop[]);
        constructor(
            focusAngle?    : number,
            focusDistance? : number,
            centerX?       : number,
            centerY?       : number,
            radius?        : number,
            proportional?  : boolean,
            cycleMethod?   : CycleMethod,
            stops?         : Stop[]) {
            super();
                this.id            = "RadialGradient_"+(RadialGradient.count++);
                this.focusAngle    = focusAngle;
                this.focusDistance = focusDistance;
                this.centerX       = centerX;
                this.centerY       = centerY;
                this.radius        = radius;
                this.proportional  = proportional;
                this.cycleMethod   = (cycleMethod == null) ? CycleMethod.NO_CYCLE : cycleMethod;
                this.stops         = Stop.normalize(stops);
                this.opaque        = this.determineOpacity();
        }


        private determineOpacity() : boolean {
            let numStops : number = this.stops.length;
            for (let i :number = 0 ; i < numStops ; i++) {
                if (!this.stops[i].color.isOpaque()) {
                    return false;
                }
            }
            return true;
        }
    }
}