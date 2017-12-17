import { Color } from "./scene/paint/Color";
import { LinearGradient } from "./scene/paint/LinearGradient";
import { CycleMethod } from "./scene/paint/LinearGradient";
import { Stop } from "./scene/paint/Stop";
import { Utils } from "./util/Utils";
import { Button } from "./scene/control/Button";
import { Canvas } from "./scene/canvas/Canvas";
import { NSVGRegion } from "./svg/scene/layout/NSVGRegion";
import { NSVGCanvas } from "./svg/scene/canvas/NSVGCanvas";
import { NSVGPath } from "./svg/scene/shape/NSVGPath";
import {ClosePath, LineTo, MoveTo} from "./scene/shape/PathElement";
import {Path} from "./scene/shape/Path";
import { TRoundedRect } from "./tsvg/Extensions";
import { ElementUtils } from "./tsvg/Utils";

export class App {
    samples : Sample[] = [];

    constructor() {
        this.samples.push( new ButtonSample() );
        this.samples.push( new CanvasSample() );
        this.samples.push( new PathSample() );
        this.samples.push( new RoundRectSample() );
    }

    loadSample(field : HTMLSelectElement) {
        var svg = ElementUtils.clear(document.getElementById("sample"));
        this.samples[field.selectedIndex].render(svg);
        location.hash = String(field.selectedIndex);
    }

    start() {
        var color = Color.AQUAMARINE;
        console.log(color.toRGBAString());
        console.log(color.toString());
        console.log(color.red + ", " + color.green + ", " + color.blue);

        console.log(Utils.RGBtoHSB(color.red, color.green, color.blue));

        console.log(color.deriveColor(0, 1.0, 0.7, 1.0));

        console.log(color.darker());

        var field = document.getElementById("samples") as HTMLSelectElement;
        field.addEventListener("change", evt => this.loadSample(field) );
        
        var html = this.samples.map( e => {
            return "<option>" + e.label + "</option>";
        }).join("");

        field.innerHTML = html;

        console.log("Hash: ", location.hash);
        if( location.hash ) {
            field.selectedIndex = Number(location.hash.substr(1));
        }
        this.loadSample(field);
    }
}

abstract class Sample {
    readonly label : string;
    constructor(label : string) {
        this.label = label;
    }

    abstract render(svg: Element);
}

class ButtonSample extends Sample {
    constructor() {
        super("JavaFX - Button");
    }

    render(svg: Element) {
        var button = new Button("Hello SVG!");
        svg.appendChild((button.getNgNode() as NSVGRegion).getDom());
        button.resize(200, 30);
        button.layoutChildren();
        console.log(svg);

    }
}

class CanvasSample extends Sample {
    constructor() {
        super("JavaFX - Canvas");
    }

    render(svg: Element) {
        var canvas = new Canvas(200, 200);
        svg.appendChild((canvas.getNgNode() as NSVGCanvas).getDom());

        canvas.resize(400, 400);
        var ctx = canvas.getGraphicsContext2D();
        ctx.clearRect(0, 0, 400, 400);
        ctx.fillStyle = 'red';
        ctx.fillRect(10, 10, 100, 25);
        ctx.fillRect(10, 60, 100, 25);
        ctx.strokeStyle = 'black';
        ctx.font        = '48px sans-serf';
        ctx.strokeText('WebFX is fun', 125, 75);
    }
}

class PathSample extends Sample {
    constructor() {
        super("JavaFX - Path");
    }

    render(svg: Element) {
        var path = new Path();
        path.add(new MoveTo(10, 10));
        path.add(new LineTo(50, 50));
        path.add(new LineTo(10, 90));
        path.add(new ClosePath());
        path.resize(400, 400);

        var fillGradient   = new LinearGradient(0, 0, 0, 1, true, CycleMethod.NO_CYCLE, [new Stop(0, Color.RED),
                                                                                         new Stop(1, Color.BLUE)]);
        var strokeGradient = new LinearGradient(0, 0, 1, 0, true, CycleMethod.NO_CYCLE, [new Stop(0, Color.LIME),
                                                                                         new Stop(1, Color.ORANGE)]);

        path.setFill(fillGradient);
        path.setStroke(strokeGradient);

        svg.appendChild((path.getNgNode() as NSVGPath).getDom());

        console.log(path.elements);
    }
}

class RoundRectSample extends Sample {
    constructor() {
        super("TSVG - Rounded Rectangle");
    }

    render(svg: Element) {
        var rect = new TRoundedRect();
        rect.x = 10;
        rect.y = 10;
        rect.width = 200;
        rect.height = 200;
        rect.fill = "transparent";
        rect.stroke = "black";
        rect.strokeWidth = 2;

        // upper left
        rect.topLeftHorizontalRadius = 20;
        rect.topLeftVerticalRadius = 20;
        
        // upper right
        rect.topRightHorizontalRadius = 20;
        rect.topRightVerticalRadius = 20;

        // lower right
        rect.bottomRightVerticalRadius = 10;
        rect.bottomRightHorizontalRadius = 10;

        // lower left
        rect.bottomLeftHorizontalRadius = 10;
        rect.bottomLeftVerticalRadius = 10;

        rect.pack();
        svg.appendChild(rect.domNode);
    }
}