namespace scene.canvas {

    export class Canvas extends Node {
        ng    : svgscene.canvas.NSVGCanvas;
        width : number;
        height: number;

        constructor(width: number, height: number) {
            super();
            this.ng     = new svgscene.canvas.NSVGCanvas(this, width, height);
            this.width  = width == null ? 0 : width;
            this.height = width == null ? 0 : height;
        }

        getGraphicsContext2D() : CanvasRenderingContext2D {
            return this.ng.getGraphicsContext2D();
        }

        getWidth() : number {
            return this.width;
        }
        setWidth(width: number) : void {
            this.width = width == null ? 0 : width;
            this.ng.sync();
        }

        getHeight() : number {
            return this.height;
        }
        setHeight(height: number) : void {
            this.height = height == null ? 0 : height;
            this.ng.sync();
        }

        getNgNode(): scene.NGNode {
            return this.ng;
        }

        resize(width: number, height: number) {
            this.width  = width == null ? 0 : width;
            this.height = height == null ? 0 : height;
            this.ng.sync();
        }
    }
}