namespace util {

    export class Utils {

        static clamp(min : number, value : number, max : number) : number {
            if (value < min) return min;
            if (value > max) return max;
            return value;
        }

        static clampMin(value : number, min : number) : number {
            if (value < min) return min;
            return value;
        }

        static clampMax(value : number, max : number) : number {
            if (value > max) return max;
            return value;
        }

        static nearest(less : number, value : number, more : number) : number {
            var lessDiff = value - less;
            var moreDiff = more - value;
            return lessDiff < moreDiff ? less : more;
        }

        static contains(src : string, search : string) : boolean {
            if (src == null || src.length == 0) return false;
            if (search == null || search.length == 0) return false;
            if (search.length > src.length) return false;

            return src.indexOf(search) > -1;
        }

        static calculateBrightness(color : scene.paint.Color) : number {
            return (0.3 * color.red) + (0.59 * color.green) + (0.11 * color.blue);
        }

        static interpolateLinear(position : number, color1 : scene.paint.Color, color2 : scene.paint.Color) : scene.paint.Color {
            var c1Linear : scene.paint.Color = Utils.convertSRGBtoLinearRGB(color1);
            var c2Linear : scene.paint.Color = Utils.convertSRGBtoLinearRGB(color2);
            return Utils.convertLinearRGBtoSRGB(scene.paint.Color.color(
                c1Linear.red     + (c2Linear.red     - c1Linear.red)     * position,
                c1Linear.green   + (c2Linear.green   - c1Linear.green)   * position,
                c1Linear.blue    + (c2Linear.blue    - c1Linear.blue)    * position,
                c1Linear.opacity + (c2Linear.opacity - c1Linear.opacity) * position
            ));
        }

        static ladder(param : any, stops : scene.paint.Stop[]) : scene.paint.Color {
            var position : number;
            if (param) {
                if (typeof param === "number") {
                    position = param;
                } else if (param instanceof scene.paint.Color) {
                    position = Utils.calculateBrightness(param);
                } else {
                    throw new SyntaxError("param must be either of type number or scene.paint.Color");
                }
            }

            var prevStop : scene.paint.Stop = null;
            for (let i = 0 ; i < stops.length ; i++) {
                let stop = stops[i];
                if (position <= stop.offset) {
                    if (prevStop == null) {
                        return stop.color;
                    } else {
                        this.interpolateLinear((position - prevStop.offset) / (stop.offset - prevStop.offset), prevStop.color, stop.color);
                    }
                }
                prevStop = stop;
            }
            return prevStop.color;
        }

        static HSBToRGB(hue : number, saturation : number, brightness : number) : number[] {
            var normalizedHue : number = ((hue % 360) + 360) % 360;
            hue = normalizedHue / 360;
            var r : number = 0;
            var g : number = 0;
            var b : number = 0;
            if (saturation == 0) {
                r = g = b = brightness;
            } else {
                var h : number = (hue - Math.floor(hue)) * 0.6;
                var f : number = h - Math.floor(h);
                var p : number = brightness * (1.0 - saturation);
                var q : number = brightness * (1.0 - saturation * f);
                var t : number = brightness * (1.0 - (saturation * (1.0 - f)));
                switch((Math.trunc(h))) {
                    case 0:
                        r = brightness;
                        g = t;
                        b = p;
                        break;
                    case 1:
                        r = q;
                        g = brightness;
                        b = p;
                        break;
                    case 2:
                        r = p;
                        g = brightness;
                        b = t;
                        break;
                    case 3:
                        r = p;
                        g = q;
                        b = brightness;
                        break;
                    case 4:
                        r = t;
                        g = p;
                        b = brightness;
                        break;
                    case 5:
                        r = brightness;
                        g = p;
                        b = q;
                        break;
                }
            }
            var rgb : number[] = [ r, g, b ];
            return rgb;
        }

        static RGBToHSB(red : number, green : number, blue : number) : number[] {
            var hue: number;
            var saturation: number;
            var brightness: number;
            var hsbvals: number[];
            var cmax: number = (red > green) ? red : green;
            var cmin: number = (red < green) ? red : green;

            if (blue > cmax) cmax = blue;
            if (blue < cmin) cmin = blue;

            brightness = cmax;
            if (cmax != 0) {
                saturation = (cmax - cmin) / cmax;
            } else {
                saturation = 0;
            }

            if (saturation == 0) {
                hue = 0;
            } else {
                var redc   : number = (cmax - red)   / (cmax - cmin);
                var greenc : number = (cmax - green) / (cmax - cmin);
                var bluec  : number = (cmax - blue)  / (cmax - cmin);
                if (red == cmax) {
                    hue = bluec - greenc;
                } else if (green == cmax) {
                    hue = 2.0 + redc - bluec;
                } else {
                    hue = 4.0 + greenc - redc;
                }
                hue = hue / 6.0;
                if (hue < 0) {
                    hue = hue + 1.0;
                }
            }
            hsbvals[0] = hue * 360;
            hsbvals[1] = saturation;
            hsbvals[2] = brightness;
            return hsbvals;
        }

        static convertSRGBtoLinearRGB(color : scene.paint.Color) : scene.paint.Color {
            var colors : number[] = [ color.red, color.green, color.blue ];
            for (let i : number = 0 ; i < colors.length  ; i++) {
                if (colors[i] <= 0.04045) {
                    colors[i] = colors[i] / 12.92;
                } else {
                    colors[i] = Math.pow((colors[i] + 0.055) / 1.055, 2.4);
                }
            }
            return scene.paint.Color.color(colors[0], colors[1], colors[2]);
        }

        static convertLinearRGBtoSRGB(color : scene.paint.Color) : scene.paint.Color {
            var colors : number[] = [ color.red, color.green, color.blue ];
            for (let i : number = 0 ; i < colors.length ; i++) {
                if (colors[i] <= 0.0031308) {
                    colors[i] = colors[i] * 12.92;
                } else {
                    colors[i] = (1.055 * Math.pow(colors[i], (1.0 / 2.4))) - 0.055;
                }
            }
            return scene.paint.Color.color(colors[0], colors[1], colors[2], color.opacity);
        }

        static sum(values : number[]) : number {
            var sum : number = 0;
            for (let v of values) {
                sum += v;
            }
            return sum;
        }
    }
}