namespace svgscene.shape {

    export class NSVGPath extends NSVGNode {
        path     : scene.shape.Path;
        dom      : SVGGElement;
        pathNode : SVGPathElement;
        currentX : number;
        currentY : number;




        addMoveTo(x : number, y : number) : void {
            this.path.moveTo(x, y);
        }

        addLineTo(x : number, y : number) : void {
            this.path.lineTo(x, y);
        }

        addQuadTo(ctrlX : number, ctrlY : number, x : number, y : number) : void {
            this.quadTo(ctrlX, ctrlY, x, y);
        }

        addCubicTo(ctrlX1 : number, ctrlY1 : number, ctrlX2 : number, ctrlY2 : number, x : number, y : number) : void {
            this.cubicTo(ctrlX1, ctrlY1, ctrlX2, ctrlY2, x, y);
        }

        addArcTo(arcX : number, arcY : number, arcW : number, arcH : number,
        arcStart : number, arcExtent : number, xAxisRotation : number) :void {
                Arc2D arc = new Arc2D(arcX, arcY, arcW, arcH, arcStart, arcExtent, Arc2D.OPEN);
                BaseTransform xform = xAxisRotation == 0.0 ? null :
                BaseTransform.getRotateInstance(xAxisRotation,
                    arc.getCenterX(), arc.getCenterY());
                PathIterator pi = arc.getPathIterator(xform);
                pi.next();
                p.append(pi, true);
        }

        addClosePath() {
            this.path.closePath();
        }

        reset() : void {
            this.path.reset();
        }

        update() : void {
            geometryChanged();
        }

        setFillRule(fillRule : scene.shape.FillRule) : void {
            this.path.setWindingRule(fillRule);
        }

        getCurrentX() : number {
            return this.path.getCurrentPoint().x;
        }

        getCurrentY() : number {
            return this.path.getCurrentPoint().y;
        }

        getGeometry() : scene.shape.Path {
            return this.path;
        }


        getShape() : scene.shape.Shape {
            return this.path;
        }

        acceptsPath2dOnUpdate() : boolean {
            return true;
        }

        updateWithPath2d(path : scene.geom.Path2D) : void {
            this.path.setTo(path);
            this.geometryChanged();
        }

        getDom(): SVGGElement {
            return this.dom;
        }
    }
}