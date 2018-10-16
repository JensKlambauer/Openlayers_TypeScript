import Vector from "ol/layer/vector";
import VectorSource from "ol/source/vector";
import GeoJSON from "ol/format/geojson";
import Style from "ol/style/style";
import Fill from "ol/style/fill";
import Stroke from "ol/style/stroke";
import TileLayer from "ol/layer/tile";
import TileWMS from "ol/source/tilewms";
import { olx } from "openlayers";

class LandkreiseLayer extends Vector {
    private title: string;

    constructor(title: string) {
        const options: olx.source.VectorOptions = {
            url : "files/landkreiseSachsen.json",
            format: new GeoJSON(),  // { featureProjection: "EPSG:3857", defaultDataProjection: "EPSG:4326" }
        };
        const vs = new VectorSource(options);
        const style = new Style({
            fill: new Fill({color: "rgba(255, 0, 0, 0.0)"}),
            stroke: new Stroke({ color: "#0000ff", width: 1})
        });

        super({source: vs, visible: false, style: style });
        this.title = title;
        this.set("title", this.title);
    }
}

class SachsenWMSDop extends TileLayer {
    constructor() {
        const src = new TileWMS({
            url: "https://geodienste.sachsen.de/wms_geosn_dop-rgb/guest",
            params: {
                LAYERS: ["sn_dop_020"], // , "sn_dop_020_info"
                SRID: "3857",
            },
        });

        super({ source: src, visible: false });
        this.set("title", "SachenDop");
        this.set("type", "base");
    }
}

class Siedlung extends TileLayer {
    constructor() {
        const src = new TileWMS({
            url: "https://geodienste.sachsen.de/wms_geosn_webatlas-sn/guest",
            params: {
                "LAYERS": "Siedlung",
                "SRID": "3857",
                "MAP_TYPE": "Siedlung"
            },
            // crossOrigin: 'anonymous'
        });
        super({source: src, visible: false});
        this.set("title", "Siedlung");
    }
}

class Gemeinden extends TileLayer {

    constructor() {
        const src = new TileWMS({
            url: "http://sg.geodatenzentrum.de/wms_vg250",
            params: {
                "LAYERS": ["vg250_gem", "vg250_krs"].join(),
                "SRID": "3857"
            }
        });
        super({source: src, visible: false});
        this.set("title", "Gemeinden");
    }
}

export { LandkreiseLayer, SachsenWMSDop, Siedlung, Gemeinden };

