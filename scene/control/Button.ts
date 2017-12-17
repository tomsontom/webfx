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
        this.addStyling();
    }

    layoutChildren() {
        this.textNode.ng.sync(); // ARGGGGHHHH
        console.log( "Width: ", this.width, "pref-width: ", this.textNode.prefWidth(-1) );
        console.log( "Height: ", this.height, "pref-height: ", this.textNode.prefHeight(-1) );
        this.textNode.relocate(this.width / 2 - this.textNode.prefWidth(-1) / 2, this.height / 2 - this.textNode.prefHeight(-1) / 2);
        super.layoutChildren(); //FIXME THIS IS NOT CORRECT
    }

    // This needs to be replaced by CSS
    addStyling() {
        let fills : BackgroundFill[] = [];
        
        {
            let color = Color.rgb(255,255,255, 0.7294117647058823);
            let radii = new CornerRadii(3);
            let insets = new Insets(0,0,-1,0);
            let fill = new BackgroundFill(color,radii,insets);
            fills.push(fill);
        }
        
        {
            let color = Color.rgb(182,182,182);
            let radii = new CornerRadii(3);
            let insets = new Insets(0,0,0,0);
            let fill = new BackgroundFill(color,radii,insets);
            fills.push(fill);
        }
    
        {
            let stops : Stop[] = [];
            stops.push(new Stop(0,Color.rgb(253,253,253)));
            stops.push(new Stop(1,Color.rgb(226,226,226)));
            let gradient = new LinearGradient(0,0,0,1,true,CycleMethod.NO_CYCLE,stops);
            let radii = new CornerRadii(2);
            let insets = new Insets(1,1,1,1);
            let fill = new BackgroundFill(gradient,radii,insets);
            fills.push(fill);
        }
    
        {
            let stops : Stop[] = [];
            stops.push(new Stop(0,Color.rgb(239,239,239)));
            stops.push(new Stop(1,Color.rgb(217,217,217)));
            let gradient = new LinearGradient(0,0,0,1,true,CycleMethod.NO_CYCLE,stops);
            let radii = new CornerRadii(1);
            let insets = new Insets(2,2,2,2);
            let fill = new BackgroundFill(gradient,radii,insets);
            fills.push(fill);
        }
        this.setBackground(new Background(fills));
        this.resize(200,30);
    }
}