import { Region } from "./../layout/Region";
import { BackgroundFill } from "./../layout/BackgroundFill";
import { Text } from "./../text/Text";
import { Color } from "./../paint/Color";
import { CornerRadii } from "./../layout/CornerRadii";
import { Stop } from "./../paint/Stop";
import { LinearGradient, CycleMethod } from "./../paint/LinearGradient";
import { Background } from "./../layout/Background";
import { Insets } from "./../../geometry/Insets";  

export class Button extends Region {
    textNode : Text;
    constructor(text : string) {
        super();
        this.textNode = new Text(text);
        this.addChild(this.textNode);
        this.addStyleing();
    }

    layoutChildren() {
        this.textNode.ng.sync(); // ARGGGGHHHH
        console.log( "Width: ", this.width, "pref-width: ", this.textNode.prefWidth(-1) );
        console.log( "Height: ", this.height, "pref-height: ", this.textNode.prefHeight(-1) );
        this.textNode.relocate(this.width / 2 - this.textNode.prefWidth(-1) / 2, this.height / 2 - this.textNode.prefHeight(-1) / 2);
        super.layoutChildren(); //FIXME THIS IS NOT CORRECT
    }

    // This needs to be replaced by CSS
    addStyleing() {
        var fills : BackgroundFill[] = [];
        
        {
            var color = Color.rgb(255,255,255, 0.7294117647058823);
            var radii = new CornerRadii(3);
            var insets = new Insets(0,0,-1,0);
            var fill = new BackgroundFill(color,radii,insets);
            fills.push(fill);
        }
        
        {
            var color = Color.rgb(182,182,182);
            var radii = new CornerRadii(3);
            var insets = new Insets(0,0,0,0);
            var fill = new BackgroundFill(color,radii,insets);
            fills.push(fill);
        }
    
        {
            var stops : Stop[] = [];
            stops.push(new Stop(0,Color.rgb(253,253,253)));
            stops.push(new Stop(1,Color.rgb(226,226,226)));
            var gradient = new LinearGradient(0,0,0,1,true,CycleMethod.NO_CYCLE,stops);
            var radii = new CornerRadii(2);
            var insets = new Insets(1,1,1,1);
            var fill = new BackgroundFill(gradient,radii,insets);
            fills.push(fill);
        }
    
        {
            var stops : Stop[] = [];
            stops.push(new Stop(0,Color.rgb(239,239,239)));
            stops.push(new Stop(1,Color.rgb(217,217,217)));
            var gradient = new LinearGradient(0,0,0,1,true,CycleMethod.NO_CYCLE,stops);
            var radii = new CornerRadii(1);
            var insets = new Insets(2,2,2,2);
            var fill = new BackgroundFill(gradient,radii,insets);
            fills.push(fill);
        }
        this.setBackground(new Background(fills));
        this.resize(200,30);
    }
}