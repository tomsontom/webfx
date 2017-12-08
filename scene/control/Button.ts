namespace scene.control {
    export class Button extends scene.layout.Region {
        textNode : scene.text.Text;
        constructor(text : string) {
            super();
            this.textNode = new scene.text.Text(text);
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
            this.setBackground(new scene.layout.Background(fills));
            this.resize(200,30);
        }
    }
}