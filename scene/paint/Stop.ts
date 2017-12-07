namespace scene.paint {
    export class Stop {
        offset : number;
        color : Color;

        constructor(offset : number,color : Color) {
            this.color = color;
            this.offset = offset;
        }
    }
}