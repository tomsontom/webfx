
/// <reference path="./scene/layout/Region.ts" />
/// <reference path="./scene/text/Text.ts" />

function run() {
    var r = new scene.layout.Region();

    var fills : scene.layout.BackgroundFill[] = [];

    {
        var color = scene.paint.Color.rgb(255,255,255, 0.7294117647058823);
        var radii = new scene.layout.CornerRadii(3);
        var insets = new geometry.Insets(0,0,-1,0);
        var fill = new scene.layout.BackgroundFill(color,radii,insets);
        fills.push(fill);
    }
    
    {
        var color = scene.paint.Color.rgb(182,182,182);
        var radii = new scene.layout.CornerRadii(3);
        var insets = new geometry.Insets(0,0,0,0);
        var fill = new scene.layout.BackgroundFill(color,radii,insets);
        fills.push(fill);
    }

    {
        var stops : scene.paint.Stop[] = [];
        stops.push(new scene.paint.Stop(0,scene.paint.Color.rgb(253,253,253)));
        stops.push(new scene.paint.Stop(1,scene.paint.Color.rgb(226,226,226)));
        var gradient = new scene.paint.LinearGradient(0,0,0,1,true,scene.paint.CycleMethod.NO_CYCLE,stops);
        var radii = new scene.layout.CornerRadii(2);
        var insets = new geometry.Insets(1,1,1,1);
        var fill = new scene.layout.BackgroundFill(gradient,radii,insets);
        fills.push(fill);
    }

    {
        var stops : scene.paint.Stop[] = [];
        stops.push(new scene.paint.Stop(0,scene.paint.Color.rgb(239,239,239)));
        stops.push(new scene.paint.Stop(1,scene.paint.Color.rgb(217,217,217)));
        var gradient = new scene.paint.LinearGradient(0,0,0,1,true,scene.paint.CycleMethod.NO_CYCLE,stops);
        var radii = new scene.layout.CornerRadii(1);
        var insets = new geometry.Insets(2,2,2,2);
        var fill = new scene.layout.BackgroundFill(gradient,radii,insets);
        fills.push(fill);
    }
    
    var t = new scene.text.Text("Hello Svg!");
    r.addChild(t);

    var svg = document.getElementById("sample");
    var node = r.getNgNode() as svgscene.layout.NSVGRegion;

    svg.appendChild(node.getDom());

    r.setBackground(new scene.layout.Background(fills));
    r.resize(200,30);
    
    t.resize(100,50);
    t.relocate(200 / 2 - t.prefWidth(-1) / 2, 30 / 2 - t.prefHeight(-1) / 2);
    r.layoutChildren();

    console.log(svg);
}