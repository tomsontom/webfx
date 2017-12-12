/// <reference path="./Paint.ts" />
/// <reference path="./Color.ts" />

namespace scene.paint {
    export class LinearGradient extends Paint {
        static count : number = 0;
        startX       : number;
        startY       : number;
        endX         : number;
        endY         : number;
        proportional : boolean;
        cycleMethod  : CycleMethod;
        stops        : Stop[];
        opaque       : boolean;
        id           : string;


        constructor();
        constructor(startX : number, startY : number, endX : number, endY : number,
                    proportional : boolean, cycleMethod : CycleMethod, stops : Stop[]);
        constructor(
            startX?       : number,
            startY?       : number,
            endX?         : number,
            endY?         : number,
            proportional? : boolean,
            cycleMethod?  : CycleMethod,
            stops?        : Stop[]) {
                super();
                this.id           = "LinearGradient_"+(LinearGradient.count++);
                this.startX       = startX;
                this.startY       = startY;
                this.endX         = endX;
                this.endY         = endY;
                this.proportional = proportional;
                this.cycleMethod  = cycleMethod;
                this.stops        = Stop.normalize(stops);
                this.opaque       = this.determineOpacity();
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

    export enum CycleMethod {
        NO_CYCLE,
        REFLECT,
        REPEAT
    } 

}