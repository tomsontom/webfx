namespace scene.layout {
    export class BackgroundFill {
        paint : scene.paint.Paint;
        cornerRadii: CornerRadii;
        insets : geometry.Insets;

        constructor(paint : scene.paint.Paint, cornerRadii: CornerRadii, insets : geometry.Insets) {
            this.paint = paint;
            this.cornerRadii = cornerRadii;
            this.insets = insets;
        }
    }
}