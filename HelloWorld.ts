import { Color } from "./scene/paint/Color";
import { Utils } from "./util/Utils";
import { Button } from "./scene/control/Button";
import { Canvas } from "./scene/canvas/Canvas";
import { NSVGRegion } from "./svg/scene/layout/NSVGRegion";
import { NSVGCanvas } from "./svg/scene/canvas/NSVGCanvas";

export class App {
    start() {
        var color = Color.AQUAMARINE;
        console.log(color.toRGBAString());
        console.log(color.toString());
        console.log(color.red + ", " + color.green + ", " + color.blue);
    
        console.log(Utils.RGBtoHSB(color.red, color.green, color.blue));
    
        console.log(color.deriveColor(0, 1.0, 0.7, 1.0));
    
        console.log(color.darker());
    
        var svg = document.getElementById("sample");
        var button = new Button("Hello SVG!");
        svg.appendChild((button.getNgNode() as NSVGRegion).getDom());
        button.resize(200,30);
        button.layoutChildren();
        console.log(svg);
    
        var canvas = new Canvas(200, 200);
        var svg1 = document.getElementById("svg");
        svg1.appendChild((canvas.getNgNode() as NSVGCanvas).getDom());
    
        canvas.resize(400, 400);
        var ctx = canvas.getGraphicsContext2D();
        ctx.clearRect(0, 0, 400, 400);
        ctx.fillStyle = 'red';
        ctx.fillRect(10, 10, 100, 25);
        ctx.fillRect(10, 60, 100, 25);
        ctx.strokeStyle = 'black';
        ctx.font = '48px sans-serf';
        ctx.strokeText('WebFX is fun', 125, 75);
    }
}