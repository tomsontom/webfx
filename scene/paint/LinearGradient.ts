/// <reference path="./Paint.ts" />
/// <reference path="./Color.ts" />

namespace scene.paint {
    export class LinearGradient extends Paint {
        static count = 0;
        startX : number;
        startY: number;
        endX : number;
        endY : number;
        proportional : boolean;
        cycleMethod : CycleMethod;
        stops : Stop[];
        id : string;

        constructor(
            startX : number,
            startY : number,
            endX : number,
            endY : number,
            proportional : boolean,
            cycleMethod : CycleMethod,
            stops : Stop[]) {
            super();
            this.id = "LinearGradient_"+(LinearGradient.count++);
            this.startX = startX;
            this.startY = startY;
            this.endX = endX;
            this.endY = endY;
            this.proportional = proportional;
            this.cycleMethod = cycleMethod;
            this.stops = stops;
        }
    }

    export enum CycleMethod {
        NO_CYCLE,
        REFLECT,
        REPEAT
    } 

}