/// <reference path="./../shape/Shape.ts" />

namespace scene.text {
    export interface NGText extends scene.shape.NGShape {
        prefWidth(height: number) : number;
        prefHeight(width: number) : number;
    }
    export class Text extends scene.shape.Shape {
        text   : string;
        ng     : NGText;
        width  : number;
        height : number;


        constructor(text : string) {
            super();
            this.ng   = new svgscene.text.NSVGText(this);
            this.text = text;
        }


        setText(text : string) {
            this.text = text;
            this.ng.sync();
        }

        getNgNode() {
            return this.ng;
        }

        resize(width: number, height: number) {
            console.log("Resize: ", width, " x ", height);
            this.width  = width;
            this.height = height;
            this.ng.sync();
        }

        prefHeight(width: number) : number {
            return this.ng.prefHeight(width);
        }

        prefWidth(height: number) : number {
            return this.ng.prefWidth(height);
        }
    }
}