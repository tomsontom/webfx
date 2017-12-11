namespace scene.shape {

    export class Path extends scene.shape.Shape{
        private path2d : geom.Path2D = null;

        elements    : scene.shape.PathElement[] = [];
        fillRule    : scene.shape.FillRule;
        isPathValid : boolean;

        constructor() {
            super();

        }


        getFillRule() : scene.shape.FillRule {
            return this.fillRule == null ? FillRule.NON_ZERO : this.fillRule;
        }
        setFillRule(value : scene.shape.FillRule) : void {
            if (this.fillRule != null || value != FillRule.NON_ZERO) {
                this.fillRule = value;
            }
        }

        impl_configShape() : geom.Path2D {
            if (this.isPathValid) {
                if (this.path2d == null) {
                    this.path2d = PathUtils.configShape(this.elements, this.fillRule == FillRule.EVEN_ODD);
                } else {
                    this.path2d.windingRule = this.fillRule == FillRule.NON_ZERO ? geom.Path2D.WIND_NON_ZERO : geom.Path2D.WIND_EVEN_ODD;
                }
                return this.path2d;
            } else {
                return new geom.Path2D();
            }
        }

        markPathDirty() : void {
            this.path2d = null;
            //impl_markDirty(DirtyBits.NODE_CONTENTS);
            //impl_geomChanged();
        }


        getNgNode(): scene.NGNode {
            //return new NGPath;
            return null;
        }

    }
}