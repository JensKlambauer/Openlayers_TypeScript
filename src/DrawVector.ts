import Vector from "ol/layer/vector";
import VectorSource from "ol/source/vector";
import Collection from "ol/collection";
import Feature from "ol/feature";
import GeoJSON from "ol/format/geojson";
import Style from "ol/style/style";
import Fill from "ol/style/fill";
import Stroke from "ol/style/stroke";
import Circle from "ol/style/circle";
import ls from "ol/loadingstrategy";
import { olx } from "openlayers";

class DrawVector extends Vector {
    private vectorSource: VectorSource;

    constructor() {
        super();
        this.set("title", "Zeichentools");
        this.setVisible(false);

        // VectorSource, Options
        let features = new Collection<Feature>();
        const options: olx.source.VectorOptions = {
            features: features,
            format: new GeoJSON(),
            strategy: ls.bbox,
        };
        options.loader = this.loader;
        this.vectorSource = new VectorSource(options);
        this.setSource(this.vectorSource);
         // Style
         const style = new Style({
            fill: new Fill({ color: "rgba(255, 0, 0, 0.1)" }),
            image: new Circle({fill: new Fill({color: "#ff0000"}), radius: 5 }),
            stroke: new Stroke({ color: "#ff0000", width: 2 })
        });
        this.setStyle(style);
    }

    private loader = (extent: ol.Extent, resolution: number, proj: ol.proj.Projection): void => {
        (async () => {
            const feats = new Array<Feature>();
        })();
    }
}

export { DrawVector };
