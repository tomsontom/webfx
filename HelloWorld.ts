
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