namespace scene.paint {
    export class Color {
        red: number;
        green: number;
        blue: number;
        opacity: number;

        constructor(red: number, green: number, blue: number, opacity: number) {
            this.red = red;
            this.green = green;
            this.blue = blue;
            this.opacity = opacity;
        }

        static rgb(red : number, green : number, blue : number, opacity? : number) : Color {
            return new Color(red / 255.0,
                green / 255.0,
                blue / 255.0,
                opacity ? opacity : 1.0);
        }

        toRGBAString() {
            return "rgba("+this.red*255+","+this.green*255+","+this.blue*255+","+this.opacity+")";
        }
    }
}