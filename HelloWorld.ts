/// <reference path="./scene/layout/Region.ts" />
/// <reference path="./scene/text/Text.ts" />
/// <reference path="./scene/control/Button.ts" />
/// <reference path="./scene/shape/PathElement.ts" />


function run() {


    /*
    var color = scene.paint.Color.AQUAMARINE;
    console.log(color.toRGBAString());
    console.log(color.toString());
    console.log(color.red + ", " + color.green + ", " + color.blue);
    console.log(util.Utils.RGBtoHSB(color.red, color.green, color.blue));
    console.log(color.deriveColor(0, 1.0, 0.7, 1.0));
    console.log(color.darker());
    */

    var svg = document.getElementById("sample");
    var button = new scene.control.Button("Hello SVG!");
    svg.appendChild((button.getNgNode() as svgscene.layout.NSVGRegion).getDom());
    button.resize(200,30);
    button.layoutChildren();
    console.log(svg);

    var canvas = new scene.canvas.Canvas(200, 200);
    var svg1 = document.getElementById("svg");
    svg1.appendChild((canvas.getNgNode() as svgscene.canvas.NSVGCanvas).getDom());

    canvas.resize(400, 400);
    var ctx = canvas.getGraphicsContext2D();
    ctx.clearRect(0, 0, 400, 400);
    ctx.fillStyle = 'red';
    ctx.fillRect(10, 10, 100, 25);
    ctx.fillRect(10, 60, 100, 25);
    ctx.strokeStyle = 'black';
    ctx.font = '48px sans-serf';
    ctx.strokeText('WebFX is fun', 125, 75);

    var path = new scene.shape.Path();
    path.add(new scene.shape.MoveTo(10, 10));
    path.add(new scene.shape.LineTo(100, 100));
    path.add(new scene.shape.LineTo(10, 200));
    path.add(new scene.shape.ClosePath());
    path.resize(400, 400);

    var svgPath = document.getElementById("path");
    svgPath.appendChild((path.getNgNode() as svgscene.shape.NSVGPath).getDom());

    console.log(path.elements);
}