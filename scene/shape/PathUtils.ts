namespace scene.shape {
    export class PathUtils {
        private PathUtils() {
        }

        static configShape(pathElements : scene.shape.PathElement[], evenOddFillRule : boolean) : geom.Path2D {
            let fr   = evenOddFillRule ? geom.Path2D.WIND_EVEN_ODD : geom.Path2D.WIND_NON_ZERO;
            let len  = pathElements.length;
            let path = new geom.Path2D(fr, len);
            pathElements.forEach((el : scene.shape.PathElement, i : number) => {
                el.impl_addTo(path);
            });
            return path;
        }
    }
}