import TileLayer from "ol/layer/tile";
import Map from "ol/map";
import Extent from "ol/extent";
import Attribution from "ol/control/attribution";
import MousePosition from "ol/control/mouseposition";
import ScaleLine from "ol/control/scaleline";
import Zoom from "ol/control/zoom";
import ZoomSlider from "ol/control/zoomslider";
import Coordinate from "ol/coordinate";
// import Control from "ol/control/control";
import Ol from "ol";
// import XYZ from "ol/source/xyz";
import View from "ol/view";
import Proj from "ol/proj";
import TileWMS from "ol/source/tilewms";
import Osm from "ol/source/osm";
import Group from "ol/layer/group";
import IMapService from "./IMapService";
import { ResetControl } from "./ResetControl";
// import object from "ol/object";
import { LayerSwitcher } from "./LayerSwitcher";
import render from "ol/render/event";
import { saveAs } from "file-saver";
import { LandkreiseLayer, SachsenWMSDop, Siedlung, Gemeinden } from "./Layers";
import { KartenFeatures } from "./Features";
import { Popup } from "./Popup";

class MapService implements IMapService {
    private popup: Popup;
    private siedlung: Ol.layer.Tile;
    private map: Ol.Map;
    private osmLayer: Ol.layer.Tile;
    private sachsenLayer: Ol.layer.Tile;
    private gemeinden: Ol.layer.Tile;
    private landkreise: Ol.layer.Vector;
    private kartenFeats: Ol.layer.Vector;
    private zoomStufe = 12;
    private center: Ol.Coordinate = Proj.transform([13.2856, 51.2986], "EPSG:4326", "EPSG:3857");
    private deutschlandExtent = Proj.transformExtent([5.7, 47.00, 15.5, 55.20], "EPSG:4326", "EPSG:3857");

    constructor() {
        this.osmLayer = new TileLayer({ source: new Osm(), visible: true });
        this.osmLayer.set("title", "OpenStreetMap");
        this.osmLayer.set("type", "base");
        this.sachsenLayer = new SachsenWMSDop();
        this.siedlung = new Siedlung();
        this.gemeinden = new Gemeinden();
        this.landkreise = new LandkreiseLayer("Sachsen-LK");
        this.kartenFeats = new KartenFeatures("Features");
    }

    public initMap(): void {
        const controls = [
            new Attribution({
                collapsible: true
            }),
            new MousePosition({
                undefinedHTML: "außerhalb",
                projection: "EPSG:4326",
                coordinateFormat: coordinate => Coordinate.format(coordinate, "{x}, {y}", 5),
            }),
            new ScaleLine(),
            new Zoom(),
            new ZoomSlider()
        ];

        const baseGrp = new Group({ layers: [this.sachsenLayer, this.osmLayer] });
        baseGrp.set("title", "Basis");
        const overlayGrp = new Group({ layers: [this.siedlung, this.gemeinden, this.landkreise, this.kartenFeats] });
        overlayGrp.set("title", "Overlays");

        this.map = new Map({
            controls: controls,
            layers: [baseGrp, overlayGrp],
            target: "map",
            view: new View({
                center: Proj.transform([13.2856, 51.2986], "EPSG:4326", "EPSG:3857"),
                projection: Proj.get("EPSG:3857"),
                zoom: 12,
                minZoom: 7,
                maxZoom: 23
            }),
        });

        const resetMapControl = new ResetControl({ center: this.center, zoom: this.zoomStufe, tipLabel: "Reset Karte" });
        this.map.addControl(resetMapControl);

        const switcher = new LayerSwitcher({ tipLabel: "Layeranzeige" });
        this.map.addControl(switcher);

        this.popup = new Popup();
        this.map.addOverlay(this.popup);
        this.map.on("singleclick", (evt) => this.popupShow(evt));
    }

    public jumpToPosition(lon: number, lat: number): boolean {
        try {
            const coord = Proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
            if (Extent.containsXY(this.deutschlandExtent, coord[0], coord[1])) {
                this.map.getView().setCenter(coord);
                this.map.getView().setZoom(13);
                return true;
            }
        } catch (Error) {
            console.log(Error.message);
            return false;
        }
        return false;
    }

    public printMap(): void {
        let loading = 0;
        let loaded = 0;
        const width = 800;
        const height = 600;
        const size = this.map.getSize();
        console.log("loading " + size);
        const extentorg = this.map.getView().calculateExtent(size);
        const source = this.osmLayer.getSource();

        const tileLoadStart = function() {
            // console.log("loading " + loading);
            ++loading;
        };

        const map = this.map;
        // let extent = map.getView().calculateExtent([width, height]);
        const tileLoadEnd = function() {
            ++loaded;
            if (loading === loaded) {
                const canvas = this;
                window.setTimeout(function() {
                    loading = 0;
                    loaded = 0;
                    const targetCanvas = document.createElement("canvas");
                    const size1 = map.getSize();
                    console.log("targetCanvas " + map.getSize());
                    targetCanvas.width = size1[0];
                    targetCanvas.height = size1[1];
                    targetCanvas.getContext("2d").drawImage(canvas,
                        0, 0, canvas.width, canvas.height,
                        0, 0, targetCanvas.width, targetCanvas.height);
                    if (navigator.msSaveBlob) {
                        navigator.msSaveBlob(targetCanvas.msToBlob(), "karte.png");
                    } else {
                        targetCanvas.toBlob(function (blob) {
                            saveAs(blob, "karte.png");
                            console.log("saveAs " + map.getSize());
                        });
                    }
                    source.un("tileloadstart", tileLoadStart);
                    source.un("tileloadend", tileLoadEnd, canvas);
                    source.un("tileloaderror", tileLoadEnd, canvas);
                    map.setSize(size);
                    map.getView().fit(extentorg);
                    map.renderSync();
                    console.log("setTimeout " + map.getSize());
                }, 1000);
            }
        };

        map.once("postcompose", function(event) {
            source.on("tileloadstart", tileLoadStart);
            source.on("tileloadend", tileLoadEnd, event.context.canvas);
            source.on("tileloaderror", tileLoadEnd, event.context.canvas);
            console.log("postcompose " + map.getSize());
            // const canvas = event.context.canvas;
            // const targetCanvas = document.createElement("canvas");
            // const size = this.map.getSize();
            // targetCanvas.width = size[0];
            // targetCanvas.height = size[1];
            // targetCanvas.getContext("2d").drawImage(canvas,
            //     0, 0, canvas.width, canvas.height,
            //     0, 0, targetCanvas.width, targetCanvas.height);
            // if (navigator.msSaveBlob) {
            //     navigator.msSaveBlob(targetCanvas.msToBlob(), "karte.png");
            // } else {
            //     targetCanvas.toBlob(function (blob) {
            //         saveAs(blob, "karte.png");
            //     });
            // }
            // console.log("postcompose " + this.map.getSize());
        });

        // const extent = map.getView().calculateExtent([width, height]);
        map.setSize([width, height]);
        // map.updateSize();
        // map.getView().fit(extentorg);
        map.renderSync();
        console.log("renderSync end " + map.getSize());
    }

    public changeLayer(): void {
        // const layers = this.map.getLayers().getArray();
        /*layers.forEach(element => {
            console.log(element.get("title"));
        });*/

        // if (layers[0].get("title") === "Osm") {
        //     this.map.removeLayer(this.osmLayer);
        //     this.map.addLayer(this.sachsenLayer);
        //     return;
        // }

        // this.map.removeLayer(this.sachsenLayer);
        // this.map.addLayer(this.osmLayer);
    }

    private popupShow(evt: any): void {
        const prettyCoord = Coordinate.toStringHDMS(Proj.transform(evt.coordinate, "EPSG:3857", "EPSG:4326"), 2);
        this.popup.show(evt.coordinate, "<div><h2>Coordinates</h2><p>" + prettyCoord + "</p></div>");
    }
}

// export {MapService};
export { MapService as Karte };
