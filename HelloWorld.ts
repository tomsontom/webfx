
/// <reference path="./scene/layout/Region.ts" />
/// <reference path="./scene/text/Text.ts" />
/// <reference path="./scene/control/Button.ts" />


function run() {
    var svg = document.getElementById("sample");
    var button = new scene.control.Button("Hello SVG!");
    svg.appendChild((button.getNgNode() as svgscene.layout.NSVGRegion).getDom());
    button.resize(200,30);
    button.layoutChildren();
    console.log(svg);

    var canvas = new scene.canvas.Canvas(200, 200);
    var svg1 = document.getElementById("svg");
    svg1.appendChild((canvas.getNgNode() as svgscene.canvas.NSVGCanvas).getDom());

    var ctx = canvas.getGraphicsContext2D();
    ctx.fillStyle = 'red';
    ctx.fillRect(10, 10, 50, 50);

}