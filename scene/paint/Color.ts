/// <reference path="./Paint.ts" />

namespace scene.paint {
    export class Color extends Paint {
        private static readonly DARKER_BRIGHTER_FACTOR     : number = 0.7;
        private static readonly SATURATE_DESATURATE_FACTOR : number = 0.7;
        private static readonly PARSE_COMPONENT            : number = 0; // percent, or clamped to [0,255] => [0,1]
        private static readonly PARSE_PERCENT              : number = 1; // clamped to [0,100]% => [0,1]
        private static readonly PARSE_ANGLE                : number = 2; // clamped to [0,360]
        private static readonly PARSE_ALPHA                : number = 3; // clamped to [0.0,1.0]

        static count : number = 0;

        red    : number;
        green  : number;
        blue   : number;
        opacity: number;
        id     : string;

        constructor();
        constructor(red : number, green : number, blue : number, opacity : number);
        constructor(red? : number, green? : number, blue? : number, opacity? : number){
            super();
            this.red     = red;
            this.green   = green;
            this.blue    = blue;
            this.opacity = opacity;
            this.id      = "Color_" + (Color.count++);
        }

        static color(red : number, green : number, blue : number, opacity? : number) : Color {
            return new Color(red, green, blue, opacity);
        }

        static rgb(red : number, green : number, blue : number, opacity? : number) : Color {
            return new Color(red / 255.0,
                green / 255.0,
                blue / 255.0,
                opacity ? opacity : 1.0);
        }

        static grayRgb(gray : number, opacity? : number) : Color {
            return Color.rgb(gray, gray, gray, opacity);
        }

        static gray(gray : number, opacity? : number) : Color {
            return Color.color(gray, gray, gray, opacity);
        }

        static web(colorString : string, opacity? : number) : Color {
            if (colorString == null) {
                throw new SyntaxError("The color components or name must be specified");
            }
            if (colorString.length == 0) {
                throw new SyntaxError("Invalid color specification");
            }

            var color : string = colorString.toLowerCase();

            if (color.startsWith("#")) {
                color = color.substring(1);
            } else if (color.startsWith("0x")) {
                color = color.substring(2);
            } else if (color.startsWith("rgb")) {
                if (color.startsWith("(", 3)) {
                    return Color.parseRGBColor(color, 4, false, opacity);
                } else if (color.startsWith("a(", 3)) {
                    return Color.parseRGBColor(color, 5, true, opacity);
                }
            } else if (color.startsWith("hsl")) {
                if (color.startsWith("(", 3)) {
                    return Color.parseHSLColor(color, 4, false, opacity);
                } else if (color.startsWith("a(", 3)) {
                    return Color.parseHSLColor(color, 5, true, opacity);
                }
            } else {
                var col : Color = NamedColors.get(color);
                if (col != null) {
                    if (opacity == 1.0) {
                        return col;
                    } else {
                        return Color.color(col.red, col.green, col.blue, opacity);
                    }
                }
            }

            var len = color.length;

            var r : number;
            var g : number;
            var b : number;
            var a : number;

            if (len == 3) {
                r = parseInt(color.substring(0, 1), 16);
                g = parseInt(color.substring(1, 2), 16);
                b = parseInt(color.substring(2, 3), 16);
                return Color.color(r / 15.0, g / 15.0, b / 15.0, opacity);
            } else if (len == 4) {
                r = parseInt(color.substring(0, 1), 16);
                g = parseInt(color.substring(1, 2), 16);
                b = parseInt(color.substring(2, 3), 16);
                a = parseInt(color.substring(3, 4), 16);
                return Color.color(r / 15.0, g / 15.0, b / 15.0, opacity * a / 15.0);
            } else if (len == 6) {
                r = parseInt(color.substring(0, 2), 16);
                g = parseInt(color.substring(2, 4), 16);
                b = parseInt(color.substring(4, 6), 16);
                return Color.rgb(r, g, b, opacity);
            } else if (len == 8) {
                r = parseInt(color.substring(0, 2), 16);
                g = parseInt(color.substring(2, 4), 16);
                b = parseInt(color.substring(4, 6), 16);
                a = parseInt(color.substring(6, 8), 16);
                return Color.rgb(r, g, b, opacity * a / 255.0);
            }

            throw new SyntaxError("Invalid color specification");
        }

        static hsb(hue : number, saturation : number, brightness : number, opacity? : number) : Color {
            Color.checkSB(saturation, brightness);
            var rgb    : number[] = util.Utils.HSBtoRGB(hue, saturation, brightness);
            var result : Color    = new Color(rgb[0], rgb[1], rgb[2], opacity);
            return result;
        }

        toRGBAString() {
            var rgb :number[] = this.toRGB();
            return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2]  + "," + this.opacity + ")";
        }

        toString() {
            var rgb : number[] = this.toRGB();
            return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
        }

        private toRGB() : number[] {
            return [ Math.trunc(this.red*255), Math.trunc(this.green*255), Math.trunc(this.blue*255) ]
        }

        getHue() : number {
            return util.Utils.RGBtoHSB(this.red, this.green, this.blue)[0];
        }

        getSaturation() : number {
            return util.Utils.RGBtoHSB(this.red, this.green, this.blue)[1];
        }

        getBrightness() : number {
            return util.Utils.RGBtoHSB(this.red, this.green, this.blue)[2];
        }

        isOpaque() : boolean {
            return this.opacity >= 1;
        }

        deriveColor(hueShift : number, saturationFactor : number, brightnessFactor : number, opacityFactor : number) : Color {
            var hsb : number[] = util.Utils.RGBtoHSB(this.red, this.green, this.blue);
            var b = hsb[2];
            if (b == 0 && brightnessFactor > 1.0) {
                b = 0.05;
            }
            var h : number = (((hsb[0] + hueShift) % 360) + 360) % 360;
            var s : number = Math.max(Math.min(hsb[1] * saturationFactor, 1.0), 0.0);
            b = Math.max(Math.min(b * brightnessFactor, 1.0), 0.0);
            var a : number = Math.max(Math.min(this.opacity * opacityFactor, 1.0), 0.0);
            return Color.hsb(h, s, b, a);
        }

        brighter() : Color {
            return this.deriveColor(0, 1.0, Color.DARKER_BRIGHTER_FACTOR, 1.0);
        }

        darker() : Color {
            return this.deriveColor(0, 1.0, Color.DARKER_BRIGHTER_FACTOR, 1.0);
        }

        saturate() : Color {
            return this.deriveColor(0, 1.0 / Color.SATURATE_DESATURATE_FACTOR, 1.0, 1.0);
        }

        desaturate() : Color {
            return this.deriveColor(0, Color.SATURATE_DESATURATE_FACTOR, 1.0, 1.0);
        }

        grayscale() : Color {
            var gray : number = 0.21 * this.red + 0.71 * this.green + 0.07 * this.blue;
            return Color.color(gray, gray, gray, this.opacity);
        }

        invert() : Color {
            return Color.color(1.0 - this.red, 1.0 - this.green, 1.0 - this.blue, this.opacity);
        }


        private static parseRGBColor(color : string, roff : number, hasAlpha : boolean, a : number) : Color {
            var rend : number = color.indexOf(',', roff);
            var gend : number = rend < 0 ? -1 : color.indexOf(',', rend+1);
            var bend : number = gend < 0 ? -1 : color.indexOf(hasAlpha ? ',' : ')', gend+1);
            var aend :number = hasAlpha ? (bend < 0 ? -1 : color.indexOf(')', bend+1)) : bend;
            if (aend >= 0) {
                var r: number = Color.parseComponent(color, roff, rend, Color.PARSE_COMPONENT);
                var g: number = Color.parseComponent(color, rend + 1, gend, Color.PARSE_COMPONENT);
                var b: number = Color.parseComponent(color, gend + 1, bend, Color.PARSE_COMPONENT);
                if (hasAlpha) {
                    a *= Color.parseComponent(color, bend + 1, aend, Color.PARSE_ALPHA);
                }
                return new Color(r, g, b, a);
            }
            throw new SyntaxError("Invalid color specification");
        }

        private static parseHSLColor(color : string, hoff : number, hasAlpha : boolean, a : number) {
            var hend : number = color.indexOf(',', hoff);
            var send : number= hend < 0 ? -1 : color.indexOf(',', hend+1);
            var lend : number= send < 0 ? -1 : color.indexOf(hasAlpha ? ',' : ')', send+1);
            var aend : number= hasAlpha ? (lend < 0 ? -1 : color.indexOf(')', lend+1)) : lend;
            if (aend >= 0) {
                var h : number= Color.parseComponent(color, hoff, hend, Color.PARSE_ANGLE);
                var s : number= Color.parseComponent(color, hend+1, send, Color.PARSE_PERCENT);
                var l : number= Color.parseComponent(color, send+1, lend, Color.PARSE_PERCENT);
                if (hasAlpha) {
                    a *= Color.parseComponent(color, lend+1, aend, Color.PARSE_ALPHA);
                }
                return Color.hsb(h, s, l, a);
            }
            throw new SyntaxError("Invalid color specification");
        }

        private static parseComponent(color : string, off : number, end : number, type : number) : number {
            color = color.substring(off, end).trim();
            if (color.endsWith("%")) {
                if (type > Color.PARSE_PERCENT) {
                    throw new SyntaxError("Invalid color specification");
                }
                type  = Color.PARSE_PERCENT;
                color = color.substring(0, color.length - 1).trim();
            } else if (type == Color.PARSE_PERCENT) {
                throw new SyntaxError("Invalid color specification");
            }
            var c : number = ((type == Color.PARSE_COMPONENT) ? parseInt(color) : parseFloat(color));
            switch (type) {
                case Color.PARSE_ALPHA:
                    return (c < 0.0) ? 0.0 : ((c > 1.0) ? 1.0 : c);
                case Color.PARSE_PERCENT:
                    return (c <= 0.0) ? 0.0 : ((c >= 100.0) ? 1.0 : (c / 100.0));
                case Color.PARSE_COMPONENT:
                    return (c <= 0.0) ? 0.0 : ((c >= 255.0) ? 1.0 : (c / 255.0));
                case Color.PARSE_ANGLE:
                    return ((c < 0.0) ? ((c % 360.0) + 360.0) : ((c > 360.0) ? (c % 360.0) : c));
            }
            throw new SyntaxError("Invalid color specification");
        }

        private static checkRgb(red : number, green : number , blue : number) : void {
            if (red < 0 || red > 255) {
                throw new SyntaxError("Color.rgb's red parameter (" + red + ") expects color values 0-255");
            }
            if (green < 0 || green > 255) {
                throw new SyntaxError("Color.rgb's green parameter (" + green + ") expects color values 0-255");
            }
            if (blue < 0 || blue > 255) {
                throw new SyntaxError("Color.rgb's blue parameter (" + blue + ") expects color values 0-255");
            }
        }

        private static checkSB(saturation : number, brightness : number) : void {
            if (saturation < 0.0 || saturation > 1.0) {
                throw new SyntaxError("Color.hsb's saturation parameter (" + saturation + ") expects values 0.0 - 1.0");
            }
            if (brightness < 0.0 || brightness > 1.0) {
                throw new SyntaxError("Color.hsb's brightness parameter (" + brightness + ") expects values 0.0 - 1.0");
            }
        }


        static readonly TRANSPARENT: Color          = new Color(0, 0, 0, 0);
        static readonly ALICEBLUE: Color            = new Color(0.9411765, 0.972549, 1.0, 1.0);
        static readonly ANTIQUEWHITE: Color         = new Color(0.98039216, 0.92156863, 0.84313726, 1.0);
        static readonly AQUA: Color                 = new Color(0.0, 1.0, 1.0, 1.0);
        static readonly AQUAMARINE: Color           = new Color(0.49803922, 1.0, 0.83137256, 1.0);
        static readonly AZURE: Color                = new Color(0.9411765, 1.0, 1.0, 1.0);
        static readonly BEIGE: Color                = new Color(0.9607843, 0.9607843, 0.8627451, 1.0);
        static readonly BISQUE: Color               = new Color(1.0, 0.89411765, 0.76862746, 1.0);
        static readonly BLACK: Color                = new Color(0.0, 0.0, 0.0, 1.0);
        static readonly BLANCHEDALMOND: Color       = new Color(1.0, 0.92156863, 0.8039216, 1.0);
        static readonly BLUE: Color                 = new Color(0.0, 0.0, 1.0, 1.0);
        static readonly BLUEVIOLET: Color           = new Color(0.5411765, 0.16862746, 0.8862745, 1.0);
        static readonly BROWN: Color                = new Color(0.64705884, 0.16470589, 0.16470589, 1.0);
        static readonly BURLYWOOD: Color            = new Color(0.87058824, 0.72156864, 0.5294118, 1.0);
        static readonly CADETBLUE: Color            = new Color(0.37254903, 0.61960787, 0.627451, 1.0);
        static readonly CHARTREUSE: Color           = new Color(0.49803922, 1.0, 0.0, 1.0);
        static readonly CHOCOLATE: Color            = new Color(0.8235294, 0.4117647, 0.11764706, 1.0);
        static readonly CORAL: Color                = new Color(1.0, 0.49803922, 0.3137255, 1.0);
        static readonly CORNFLOWERBLUE: Color       = new Color(0.39215687, 0.58431375, 0.92941177, 1.0);
        static readonly CORNSILK: Color             = new Color(1.0, 0.972549, 0.8627451, 1.0);
        static readonly CRIMSON: Color              = new Color(0.8627451, 0.078431375, 0.23529412, 1.0);
        static readonly CYAN: Color                 = new Color(0.0, 1.0, 1.0, 1.0);
        static readonly DARKBLUE: Color             = new Color(0.0, 0.0, 0.54509807, 1.0);
        static readonly DARKCYAN: Color             = new Color(0.0, 0.54509807, 0.54509807, 1.0);
        static readonly DARKGOLDENROD: Color        = new Color(0.72156864, 0.5254902, 0.043137256, 1.0);
        static readonly DARKGRAY: Color             = new Color(0.6627451, 0.6627451, 0.6627451, 1.0);
        static readonly DARKGREEN: Color            = new Color(0.0, 0.39215687, 0.0, 1.0);
        static readonly DARKGREY                    = Color.DARKGRAY;
        static readonly DARKKHAKI: Color            = new Color(0.7411765, 0.7176471, 0.41960785, 1.0);
        static readonly DARKMAGENTA: Color          = new Color(0.54509807, 0.0, 0.54509807, 1.0);
        static readonly DARKOLIVEGREEN: Color       = new Color(0.33333334, 0.41960785, 0.18431373, 1.0);
        static readonly DARKORANGE: Color           = new Color(1.0, 0.54901963, 0.0, 1.0);
        static readonly DARKORCHID: Color           = new Color(0.6, 0.19607843, 0.8, 1.0);
        static readonly DARKRED: Color              = new Color(0.54509807, 0.0, 0.0, 1.0);
        static readonly DARKSALMON: Color           = new Color(0.9137255, 0.5882353, 0.47843137, 1.0);
        static readonly DARKSEAGREEN: Color         = new Color(0.56078434, 0.7372549, 0.56078434, 1.0);
        static readonly DARKSLATEBLUE: Color        = new Color(0.28235295, 0.23921569, 0.54509807, 1.0);
        static readonly DARKSLATEGRAY: Color        = new Color(0.18431373, 0.30980393, 0.30980393, 1.0);
        static readonly DARKSLATEGREY               = Color.DARKSLATEGRAY;
        static readonly DARKTURQUOISE: Color        = new Color(0.0, 0.80784315, 0.81960785, 1.0);
        static readonly DARKVIOLET: Color           = new Color(0.5803922, 0.0, 0.827451, 1.0);
        static readonly DEEPPINK: Color             = new Color(1.0, 0.078431375, 0.5764706, 1.0);
        static readonly DEEPSKYBLUE: Color          = new Color(0.0, 0.7490196, 1.0, 1.0);
        static readonly DIMGRAY: Color              = new Color(0.4117647, 0.4117647, 0.4117647, 1.0);
        static readonly DIMGREY                     = Color.DIMGRAY;
        static readonly DODGERBLUE: Color           = new Color(0.11764706, 0.5647059, 1.0, 1.0);
        static readonly FIREBRICK: Color            = new Color(0.69803923, 0.13333334, 0.13333334, 1.0);
        static readonly FLORALWHITE: Color          = new Color(1.0, 0.98039216, 0.9411765, 1.0);
        static readonly FORESTGREEN: Color          = new Color(0.13333334, 0.54509807, 0.13333334, 1.0);
        static readonly FUCHSIA: Color              = new Color(1.0, 0.0, 1.0, 1.0);
        static readonly GAINSBORO: Color            = new Color(0.8627451, 0.8627451, 0.8627451, 1.0);
        static readonly GHOSTWHITE: Color           = new Color(0.972549, 0.972549, 1.0, 1.0);
        static readonly GOLD: Color                 = new Color(1.0, 0.84313726, 0.0, 1.0);
        static readonly GOLDENROD: Color            = new Color(0.85490197, 0.64705884, 0.1254902, 1.0);
        static readonly GRAY: Color                 = new Color(0.5019608, 0.5019608, 0.5019608, 1.0);
        static readonly GREEN: Color                = new Color(0.0, 0.5019608, 0.0, 1.0);
        static readonly GREENYELLOW: Color          = new Color(0.6784314, 1.0, 0.18431373, 1.0);
        static readonly GREY                        = Color.GRAY;
        static readonly HONEYDEW: Color             = new Color(0.9411765, 1.0, 0.9411765, 1.0);
        static readonly HOTPINK: Color              = new Color(1.0, 0.4117647, 0.7058824, 1.0);
        static readonly INDIANRED: Color            = new Color(0.8039216, 0.36078432, 0.36078432, 1.0);
        static readonly INDIGO: Color               = new Color(0.29411766, 0.0, 0.50980395, 1.0);
        static readonly IVORY: Color                = new Color(1.0, 1.0, 0.9411765, 1.0);
        static readonly KHAKI: Color                = new Color(0.9411765, 0.9019608, 0.54901963, 1.0);
        static readonly LAVENDER: Color             = new Color(0.9019608, 0.9019608, 0.98039216, 1.0);
        static readonly LAVENDERBLUSH: Color        = new Color(1.0, 0.9411765, 0.9607843, 1.0);
        static readonly LAWNGREEN: Color            = new Color(0.4862745, 0.9882353, 0.0, 1.0);
        static readonly LEMONCHIFFON: Color         = new Color(1.0, 0.98039216, 0.8039216, 1.0);
        static readonly LIGHTBLUE: Color            = new Color(0.6784314, 0.84705883, 0.9019608, 1.0);
        static readonly LIGHTCORAL: Color           = new Color(0.9411765, 0.5019608, 0.5019608, 1.0);
        static readonly LIGHTCYAN: Color            = new Color(0.8784314, 1.0, 1.0, 1.0);
        static readonly LIGHTGOLDENRODYELLOW: Color = new Color(0.98039216, 0.98039216, 0.8235294, 1.0);
        static readonly LIGHTGRAY: Color            = new Color(0.827451, 0.827451, 0.827451, 1.0);
        static readonly LIGHTGREEN: Color           = new Color(0.5647059, 0.93333334, 0.5647059, 1.0);
        static readonly LIGHTGREY                   = Color.LIGHTGRAY;
        static readonly LIGHTPINK: Color            = new Color(1.0, 0.7137255, 0.75686276, 1.0);
        static readonly LIGHTSALMON: Color          = new Color(1.0, 0.627451, 0.47843137, 1.0);
        static readonly LIGHTSEAGREEN: Color        = new Color(0.1254902, 0.69803923, 0.6666667, 1.0);
        static readonly LIGHTSKYBLUE: Color         = new Color(0.5294118, 0.80784315, 0.98039216, 1.0);
        static readonly LIGHTSLATEGRAY: Color       = new Color(0.46666667, 0.53333336, 0.6, 1.0);
        static readonly LIGHTSLATEGREY              = Color.LIGHTSLATEGRAY;
        static readonly LIGHTSTEELBLUE: Color       = new Color(0.6901961, 0.76862746, 0.87058824, 1.0);
        static readonly LIGHTYELLOW: Color          = new Color(1.0, 1.0, 0.8784314, 1.0);
        static readonly LIME: Color                 = new Color(0.0, 1.0, 0.0, 1.0);
        static readonly LIMEGREEN: Color            = new Color(0.19607843, 0.8039216, 0.19607843, 1.0);
        static readonly LINEN: Color                = new Color(0.98039216, 0.9411765, 0.9019608, 1.0);
        static readonly MAGENTA: Color              = new Color(1.0, 0.0, 1.0, 1.0);
        static readonly MAROON: Color               = new Color(0.5019608, 0.0, 0.0, 1.0);
        static readonly MEDIUMAQUAMARINE: Color     = new Color(0.4, 0.8039216, 0.6666667, 1.0);
        static readonly MEDIUMBLUE: Color           = new Color(0.0, 0.0, 0.8039216, 1.0);
        static readonly MEDIUMORCHID: Color         = new Color(0.7294118, 0.33333334, 0.827451, 1.0);
        static readonly MEDIUMPURPLE: Color         = new Color(0.5764706, 0.4392157, 0.85882354, 1.0);
        static readonly MEDIUMSEAGREEN: Color       = new Color(0.23529412, 0.7019608, 0.44313726, 1.0);
        static readonly MEDIUMSLATEBLUE: Color      = new Color(0.48235294, 0.40784314, 0.93333334, 1.0);
        static readonly MEDIUMSPRINGGREEN: Color    = new Color(0.0, 0.98039216, 0.6039216, 1.0);
        static readonly MEDIUMTURQUOISE: Color      = new Color(0.28235295, 0.81960785, 0.8, 1.0);
        static readonly MEDIUMVIOLETRED: Color      = new Color(0.78039217, 0.08235294, 0.52156866, 1.0);
        static readonly MIDNIGHTBLUE: Color         = new Color(0.09803922, 0.09803922, 0.4392157, 1.0);
        static readonly MINTCREAM: Color            = new Color(0.9607843, 1.0, 0.98039216, 1.0);
        static readonly MISTYROSE: Color            = new Color(1.0, 0.89411765, 0.88235295, 1.0);
        static readonly MOCCASIN: Color             = new Color(1.0, 0.89411765, 0.70980394, 1.0);
        static readonly NAVAJOWHITE: Color          = new Color(1.0, 0.87058824, 0.6784314, 1.0);
        static readonly NAVY: Color                 = new Color(0.0, 0.0, 0.5019608, 1.0);
        static readonly OLDLACE: Color              = new Color(0.99215686, 0.9607843, 0.9019608, 1.0);
        static readonly OLIVE: Color                = new Color(0.5019608, 0.5019608, 0.0, 1.0);
        static readonly OLIVEDRAB: Color            = new Color(0.41960785, 0.5568628, 0.13725491, 1.0);
        static readonly ORANGE: Color               = new Color(1.0, 0.64705884, 0.0, 1.0);
        static readonly ORANGERED: Color            = new Color(1.0, 0.27058825, 0.0, 1.0);
        static readonly ORCHID: Color               = new Color(0.85490197, 0.4392157, 0.8392157, 1.0);
        static readonly PALEGOLDENROD: Color        = new Color(0.93333334, 0.9098039, 0.6666667, 1.0);
        static readonly PALEGREEN: Color            = new Color(0.59607846, 0.9843137, 0.59607846, 1.0);
        static readonly PALETURQUOISE: Color        = new Color(0.6862745, 0.93333334, 0.93333334, 1.0);
        static readonly PALEVIOLETRED: Color        = new Color(0.85882354, 0.4392157, 0.5764706, 1.0);
        static readonly PAPAYAWHIP: Color           = new Color(1.0, 0.9372549, 0.8352941, 1.0);
        static readonly PEACHPUFF: Color            = new Color(1.0, 0.85490197, 0.7254902, 1.0);
        static readonly PERU: Color                 = new Color(0.8039216, 0.52156866, 0.24705882, 1.0);
        static readonly PINK: Color                 = new Color(1.0, 0.7529412, 0.79607844, 1.0);
        static readonly PLUM: Color                 = new Color(0.8666667, 0.627451, 0.8666667, 1.0);
        static readonly POWDERBLUE: Color           = new Color(0.6901961, 0.8784314, 0.9019608, 1.0);
        static readonly PURPLE: Color               = new Color(0.5019608, 0.0, 0.5019608, 1.0);
        static readonly RED: Color                  = new Color(1.0, 0.0, 0.0, 1.0);
        static readonly ROSYBROWN: Color            = new Color(0.7372549, 0.56078434, 0.56078434, 1.0);
        static readonly ROYALBLUE: Color            = new Color(0.25490198, 0.4117647, 0.88235295, 1.0);
        static readonly SADDLEBROWN: Color          = new Color(0.54509807, 0.27058825, 0.07450981, 1.0);
        static readonly SALMON: Color               = new Color(0.98039216, 0.5019608, 0.44705883, 1.0);
        static readonly SANDYBROWN: Color           = new Color(0.95686275, 0.6431373, 0.3764706, 1.0);
        static readonly SEAGREEN: Color             = new Color(0.18039216, 0.54509807, 0.34117648, 1.0);
        static readonly SEASHELL: Color             = new Color(1.0, 0.9607843, 0.93333334, 1.0);
        static readonly SIENNA: Color               = new Color(0.627451, 0.32156864, 0.1764706, 1.0);
        static readonly SILVER: Color               = new Color(0.7529412, 0.7529412, 0.7529412, 1.0);
        static readonly SKYBLUE: Color              = new Color(0.5294118, 0.80784315, 0.92156863, 1.0);
        static readonly SLATEBLUE: Color            = new Color(0.41568628, 0.3529412, 0.8039216, 1.0);
        static readonly SLATEGRAY: Color            = new Color(0.4392157, 0.5019608, 0.5647059, 1.0);
        static readonly SLATEGREY                   = Color.SLATEGRAY;
        static readonly SNOW: Color                 = new Color(1.0, 0.98039216, 0.98039216, 1.0);
        static readonly SPRINGGREEN: Color          = new Color(0.0, 1.0, 0.49803922, 1.0);
        static readonly STEELBLUE: Color            = new Color(0.27450982, 0.50980395, 0.7058824, 1.0);
        static readonly TAN: Color                  = new Color(0.8235294, 0.7058824, 0.54901963, 1.0);
        static readonly TEAL: Color                 = new Color(0.0, 0.5019608, 0.5019608, 1.0);
        static readonly THISTLE: Color              = new Color(0.84705883, 0.7490196, 0.84705883, 1.0);
        static readonly TOMATO: Color               = new Color(1.0, 0.3882353, 0.2784314, 1.0);
        static readonly TURQUOISE: Color            = new Color(0.2509804, 0.8784314, 0.8156863, 1.0);
        static readonly VIOLET: Color               = new Color(0.93333334, 0.50980395, 0.93333334, 1.0);
        static readonly WHEAT: Color                = new Color(0.9607843, 0.87058824, 0.7019608, 1.0);
        static readonly WHITE: Color                = new Color(1.0, 1.0, 1.0, 1.0);
        static readonly WHITESMOKE: Color           = new Color(0.9607843, 0.9607843, 0.9607843, 1.0);
        static readonly YELLOW: Color               = new Color(1.0, 1.0, 0.0, 1.0);
        static readonly YELLOWGREEN: Color          = new Color(0.6039216, 0.8039216, 0.19607843, 1.0);
    }

    class NamedColors {
        private static readonly namedColors : {[key : string] : Color } = NamedColors.createNamedColors();

        static get(name : string) : Color {
            return NamedColors.namedColors[name];
        }

        private static createNamedColors() : {[key : string] : Color } {
            var colors : {[key : string] : Color } = {
                "aliceblue" :            Color.ALICEBLUE,
                "antiquewhite" :         Color.ANTIQUEWHITE,
                "aqua" :                 Color.AQUA,
                "aquamarine" :           Color.AQUAMARINE,
                "azure" :                Color.AZURE,
                "beige" :                Color.BEIGE,
                "bisque" :               Color.BISQUE,
                "black" :                Color.BLACK,
                "blanchedalmond" :       Color.BLANCHEDALMOND,
                "blue" :                 Color.BLUE,
                "blueviolet" :           Color.BLUEVIOLET,
                "brown" :                Color.BROWN,
                "burlywood" :            Color.BURLYWOOD,
                "cadetblue" :            Color.CADETBLUE,
                "chartreuse" :           Color.CHARTREUSE,
                "chocolate" :            Color.CHOCOLATE,
                "coral" :                Color.CORAL,
                "cornflowerblue" :       Color.CORNFLOWERBLUE,
                "cornsilk" :             Color.CORNSILK,
                "crimson" :              Color.CRIMSON,
                "cyan" :                 Color.CYAN,
                "darkblue" :             Color.DARKBLUE,
                "darkcyan" :             Color.DARKCYAN,
                "darkgoldenrod" :        Color.DARKGOLDENROD,
                "darkgray" :             Color.DARKGRAY,
                "darkgreen" :            Color.DARKGREEN,
                "darkgrey" :             Color.DARKGREY,
                "darkkhaki" :            Color.DARKKHAKI,
                "darkmagenta" :          Color.DARKMAGENTA,
                "darkolivegreen" :       Color.DARKOLIVEGREEN,
                "darkorange" :           Color.DARKORANGE,
                "darkorchid" :           Color.DARKORCHID,
                "darkred" :              Color.DARKRED,
                "darksalmon" :           Color.DARKSALMON,
                "darkseagreen" :         Color.DARKSEAGREEN,
                "darkslateblue" :        Color.DARKSLATEBLUE,
                "darkslategray" :        Color.DARKSLATEGRAY,
                "darkslategrey" :        Color.DARKSLATEGREY,
                "darkturquoise" :        Color.DARKTURQUOISE,
                "darkviolet" :           Color.DARKVIOLET,
                "deeppink" :             Color.DEEPPINK,
                "deepskyblue" :          Color.DEEPSKYBLUE,
                "dimgray" :              Color.DIMGRAY,
                "dimgrey" :              Color.DIMGREY,
                "dodgerblue" :           Color.DODGERBLUE,
                "firebrick" :            Color.FIREBRICK,
                "floralwhite" :          Color.FLORALWHITE,
                "forestgreen" :          Color.FORESTGREEN,
                "fuchsia" :              Color.FUCHSIA,
                "gainsboro" :            Color.GAINSBORO,
                "ghostwhite" :           Color.GHOSTWHITE,
                "gold" :                 Color.GOLD,
                "goldenrod" :            Color.GOLDENROD,
                "gray" :                 Color.GRAY,
                "green" :                Color.GREEN,
                "greenyellow" :          Color.GREENYELLOW,
                "grey" :                 Color.GREY,
                "honeydew" :             Color.HONEYDEW,
                "hotpink" :              Color.HOTPINK,
                "indianred" :            Color.INDIANRED,
                "indigo" :               Color.INDIGO,
                "ivory" :                Color.IVORY,
                "khaki" :                Color.KHAKI,
                "lavender" :             Color.LAVENDER,
                "lavenderblush" :        Color.LAVENDERBLUSH,
                "lawngreen" :            Color.LAWNGREEN,
                "lemonchiffon" :         Color.LEMONCHIFFON,
                "lightblue" :            Color.LIGHTBLUE,
                "lightcoral" :           Color.LIGHTCORAL,
                "lightcyan" :            Color.LIGHTCYAN,
                "lightgoldenrodyellow" : Color.LIGHTGOLDENRODYELLOW,
                "lightgray" :            Color.LIGHTGRAY,
                "lightgreen" :           Color.LIGHTGREEN,
                "lightgrey" :            Color.LIGHTGREY,
                "lightpink" :            Color.LIGHTPINK,
                "lightsalmon" :          Color.LIGHTSALMON,
                "lightseagreen" :        Color.LIGHTSEAGREEN,
                "lightskyblue" :         Color.LIGHTSKYBLUE,
                "lightslategray" :       Color.LIGHTSLATEGRAY,
                "lightslategrey" :       Color.LIGHTSLATEGREY,
                "lightsteelblue" :       Color.LIGHTSTEELBLUE,
                "lightyellow" :          Color.LIGHTYELLOW,
                "lime" :                 Color.LIME,
                "limegreen" :            Color.LIMEGREEN,
                "linen" :                Color.LINEN,
                "magenta" :              Color.MAGENTA,
                "maroon" :               Color.MAROON,
                "mediumaquamarine" :     Color.MEDIUMAQUAMARINE,
                "mediumblue" :           Color.MEDIUMBLUE,
                "mediumorchid" :         Color.MEDIUMORCHID,
                "mediumpurple" :         Color.MEDIUMPURPLE,
                "mediumseagreen" :       Color.MEDIUMSEAGREEN,
                "mediumslateblue" :      Color.MEDIUMSLATEBLUE,
                "mediumspringgreen" :    Color.MEDIUMSPRINGGREEN,
                "mediumturquoise" :      Color.MEDIUMTURQUOISE,
                "mediumvioletred" :      Color.MEDIUMVIOLETRED,
                "midnightblue" :         Color.MIDNIGHTBLUE,
                "mintcream" :            Color.MINTCREAM,
                "mistyrose" :            Color.MISTYROSE,
                "moccasin" :             Color.MOCCASIN,
                "navajowhite" :          Color.NAVAJOWHITE,
                "navy" :                 Color.NAVY,
                "oldlace" :              Color.OLDLACE,
                "olive" :                Color.OLIVE,
                "olivedrab" :            Color.OLIVEDRAB,
                "orange" :               Color.ORANGE,
                "orangered" :            Color.ORANGERED,
                "orchid" :               Color.ORCHID,
                "palegoldenrod" :        Color.PALEGOLDENROD,
                "palegreen" :            Color.PALEGREEN,
                "paleturquoise" :        Color.PALETURQUOISE,
                "palevioletred" :        Color.PALEVIOLETRED,
                "papayawhip" :           Color.PAPAYAWHIP,
                "peachpuff" :            Color.PEACHPUFF,
                "peru" :                 Color.PERU,
                "pink" :                 Color.PINK,
                "plum" :                 Color.PLUM,
                "powderblue" :           Color.POWDERBLUE,
                "purple" :               Color.PURPLE,
                "red" :                  Color.RED,
                "rosybrown" :            Color.ROSYBROWN,
                "royalblue" :            Color.ROYALBLUE,
                "saddlebrown" :          Color.SADDLEBROWN,
                "salmon" :               Color.SALMON,
                "sandybrown" :           Color.SANDYBROWN,
                "seagreen" :             Color.SEAGREEN,
                "seashell" :             Color.SEASHELL,
                "sienna" :               Color.SIENNA,
                "silver" :               Color.SILVER,
                "skyblue" :              Color.SKYBLUE,
                "slateblue" :            Color.SLATEBLUE,
                "slategray" :            Color.SLATEGRAY,
                "slategrey" :            Color.SLATEGREY,
                "snow" :                 Color.SNOW,
                "springgreen" :          Color.SPRINGGREEN,
                "steelblue" :            Color.STEELBLUE,
                "tan" :                  Color.TAN,
                "teal" :                 Color.TEAL,
                "thistle" :              Color.THISTLE,
                "tomato" :               Color.TOMATO,
                "transparent" :          Color.TRANSPARENT,
                "turquoise" :            Color.TURQUOISE,
                "violet" :               Color.VIOLET,
                "wheat" :                Color.WHEAT,
                "white" :                Color.WHITE,
                "whitesmoke" :           Color.WHITESMOKE,
                "yellow" :               Color.YELLOW,
                "yellowgreen" :          Color.YELLOWGREEN
            };
            return colors;
        }
    }
}