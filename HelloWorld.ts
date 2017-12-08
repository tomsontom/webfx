
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
}