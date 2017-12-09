namespace svgscene.layout {

    export class NSVGRegion extends NSVGParent implements scene.layout.NGRegion {
        region: scene.layout.Region;
        dom: SVGGElement;
        colorContainer: SVGGElement;
        defs: SVGDefsElement;
        rootRect: SVGRectElement;
        backgroundRects: SVGRectElement[]           = [];
        linearGradients: SVGLinearGradientElement[] = [];
        children: NSVGNode[]                        = [];

        constructor(region: scene.layout.Region) {
            super();
            this.region   = region;
            this.dom      = NSVGNode.createGElement();
            this.rootRect = NSVGNode.createRectElement();
            this.rootRect.setAttribute("fill", "rgba(0,0,0,0)");
            this.colorContainer = NSVGNode.createGElement();
            this.defs           = NSVGNode.createDefsElement();
            this.dom.appendChild(this.defs);
            this.dom.appendChild(this.rootRect);
            this.dom.appendChild(this.colorContainer);
        }

        static value(v: number, proportional: boolean) {
            if (proportional) {
                return v * 100 + "%";
            }
            return v + "";
        }

        syncChildren() {
            this.children.forEach(n => {
                this.dom.removeChild(n.getDom());
            });
            this.region.children.map(n => {
                var rv = (n.getNgNode() as NSVGNode).getDom();
                var x  = n.layoutX ? n.layoutX : 0;
                var y  = n.layoutY ? n.layoutY : 0;
                rv.setAttribute("transform", "translate(" + x + "," + y + ")");
                return rv;
            })
                .forEach(n => this.dom.appendChild(n));
        }

        getDom() {
            return this.dom;
        }

        // TODO Temporary until we have observables
        sync() {
            if (this.region.width) {
                this.rootRect.setAttribute("width", this.region.width + "");
            }

            if (this.region.height) {
                this.rootRect.setAttribute("height", this.region.height + "");
            }

            this.backgroundRects.forEach((r) => this.colorContainer.removeChild(r));
            this.linearGradients.forEach((g) => this.defs.removeChild(g));

            if (this.region.background) {
                this.linearGradients = this.region.background.fills.map((bgfill) => {
                    return bgfill.paint;
                })
                    .filter((paint) => {
                        return paint instanceof scene.paint.LinearGradient;
                    })
                    .map((paint) => {
                        var lg     = paint as scene.paint.LinearGradient;
                        var e      = NSVGNode.createLinearGradientElement();
                        var suffix = lg.proportional ? "%" : "";
                        e.setAttribute("x1", NSVGRegion.value(lg.startX, lg.proportional));
                        e.setAttribute("x2", NSVGRegion.value(lg.endX, lg.proportional));
                        e.setAttribute("y1", NSVGRegion.value(lg.startY, lg.proportional));
                        e.setAttribute("y2", NSVGRegion.value(lg.endY, lg.proportional));
                        e.setAttribute("id", lg.id);

                        lg.stops.map((stop) => {
                            var s = NSVGNode.createStopElement();
                            s.setAttribute("offset", NSVGRegion.value(stop.offset, lg.proportional));
                            s.setAttribute("stop-color", stop.color.toRGBAString());
                            return s;
                        })
                            .forEach((stop) => {
                                e.appendChild(stop);
                            });

                        return e;
                    });
                this.linearGradients.forEach(lg => {
                    this.defs.appendChild(lg);
                });
            }

            if (this.region.background) {
                this.backgroundRects = this.region.background.fills.map((bgfill) => {
                    var rect = NSVGNode.createRectElement();
                    if (this.region.width) {
                        var w = this.region.width;
                        var x = 0;
                        if (bgfill.insets) {
                            w -= bgfill.insets.left + bgfill.insets.right;
                            x = bgfill.insets.right;
                        }
                        rect.setAttribute("x", x + "");
                        rect.setAttribute("width", w + "");
                    }

                    if (this.region.height) {
                        var h = this.region.height;
                        var y = 0;
                        if (bgfill.insets) {
                            h -= bgfill.insets.top + bgfill.insets.bottom;
                            y = bgfill.insets.top;
                        }
                        rect.setAttribute("y", y + "");
                        rect.setAttribute("height", h + "");
                    }

                    var paint  = bgfill.paint;
                    var corner = bgfill.cornerRadii;
                    if (paint instanceof scene.paint.Color) {
                        var col = paint as scene.paint.Color;
                        rect.setAttribute("fill", col.toRGBAString());
                    } else if (paint instanceof scene.paint.LinearGradient) {
                        var lgradient = paint as scene.paint.LinearGradient;
                        rect.setAttribute("fill", "url(#" + lgradient.id + ")");
                    }
                    // FIXME need to use a polyline
                    if (corner) {
                        rect.setAttribute("rx", corner.topLeftHorizontalRadius + "");
                        rect.setAttribute("ry", corner.topLeftVerticalRadius + "");
                    }

                    return rect;
                });
                this.backgroundRects.forEach((r) => {
                    this.colorContainer.appendChild(r);
                });
                console.log(this.backgroundRects);
            }
        }
    }
}