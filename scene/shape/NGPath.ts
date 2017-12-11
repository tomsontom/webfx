namespace scene.shape {
    export class NGPath extends scene.shape.NGShape {
        p: geom.Path2D = new geom.Path2D();

        reset(): void {
            this.p.reset();
        }

        update(): void {
            //this.geometryChanged();
            this.sync();
        }

        toWindingRule(rule: scene.shape.FillRule): number {
            if (rule == scene.shape.FillRule.NON_ZERO) {
                return geom.Path2D.WIND_NON_ZERO;
            } else {
                return geom.Path2D.WIND_EVEN_ODD;
            }
        }

        setFillRule(fillRule: scene.shape.FillRule): void {
            this.p.windingRule = this.toWindingRule(fillRule);
        }

        getCurrentX(): number {
            return this.p.currentPoint.x;
        }

        getCurrentY(): number {
            return this.p.currentPoint.y;
        }

        addClosePath(): void {
            this.p.closePath();
        }

        addMoveTo(x: number, y: number): void {
            this.p.moveTo(x, y);
        }

        addLineTo(x: number, y: number): void {
            this.p.lineTo(x, y);
        }

        addQuadTo(ctrlx: number, ctrly: number, x: number, y: number): void {
            this.p.quadTo(ctrlx, ctrly, x, y);
        }

        addCubicTo(ctrlx1: number, ctrly1: number, ctrlx2: number, ctrly2: number, x: number, y: number): void {
            this.p.curveTo(ctrlx1, ctrly1, ctrlx2, ctrly2, x, y);
        }

        addArcTo(arcX: number, arcY: number, arcW: number, arcH: number, arcStart: number, arcExtent: number,
                 xAxisRotation: number): void {
            Arc2D
            arc = new Arc2D(arcX, arcY, arcW, arcH, arcStart, arcExtent, Arc2D.OPEN);
            BaseTransform
            xform = xAxisRotation ==
                    0.0 ? null : BaseTransform.getRotateInstance(xAxisRotation, arc.getCenterX(), arc.getCenterY());
            geom.PathIterator
            pi = arc.getPathIterator(xform);

            pi.next();
            this.p.append(pi, true);
        }

        getGeometry(): geom.Path2D {
            return this.p;
        }

        getShape(): scene.shape.Shape {
            return this.p;
        }

        acceptsPath2dOnUpdate(): boolean {
            return true;
        }

        updateWithPath2d(path: Path2D): void {
            this.p.setTo(path);
            this.sync();
        }

        sync() {
            // initiate redraw here
        }
    }
}