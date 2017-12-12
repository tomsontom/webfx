import { NSVGNode } from "./../NSVGNode";
import { Canvas } from "./../../../scene/canvas/Canvas";

export class NSVGCanvas extends NSVGNode {
    canvas    : Canvas;
    dom       : SVGGElement;
    canvasNode: HTMLCanvasElement;
    ctx       : CanvasRenderingContext2D;

    constructor(canvas: Canvas, width: number, height: number) {
        super();
        this.canvas = canvas;

        this.canvasNode = document.createElement('canvas');
        this.canvasNode.setAttribute('id', 'canvas');
        this.canvasNode.width  = width == null ? 0 : width;
        this.canvasNode.height = width == null ? 0 : height;

        this.dom = NSVGNode.createForeignObjectElement();
        this.dom.appendChild(this.canvasNode);
    }

    getGraphicsContext2D() : CanvasRenderingContext2D {
        if (this.ctx == null) {
            this.ctx = this.canvasNode.getContext('2d');
        }
        return this.ctx;
    }

    getDom(): SVGGElement {
        return this.dom;
    }

    sync() {
        while( this.canvasNode.firstChild ) {
            this.canvasNode.removeChild(this.canvasNode.firstChild);
        }

        if( this.canvas.getWidth() ) {
            this.canvasNode.width = this.canvas.getWidth();
        }

        if( this.canvas.getHeight() ) {
            this.canvasNode.height = this.canvas.getHeight();
        }
    }
}