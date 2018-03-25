import Vector from "ol/layer/vector";
import VectorSource from "ol/source/vector";
import GeoJSON from "ol/format/geojson";
import Style from "ol/style/style";
import Fill from "ol/style/fill";
import Stroke from "ol/style/stroke";
import Circle from "ol/style/circle";
import TileLayer from "ol/layer/tile";
import TileWMS from "ol/source/tilewms";
import Collection from "ol/collection";
import Feature from "ol/feature";
import WKT from "ol/format/wkt";
import ls from "ol/loadingstrategy";
// import Extent from "ol/extent";
import * as $ from "jquery";
import { olx } from "openlayers";

class KartenFeatures extends Vector {
    private vectorSource: VectorSource;

    constructor(title: string) {
        super();    // {title: title}
        this.set("title", title);
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
            stroke: new Stroke({ color: "#ff0000", width: 2 }),
            image: new Circle({fill: new Fill({color: "#ff0000"}), radius: 5 })
        });
        this.setStyle(style);
        // super({source: vectorSource, visible: false, style: style });
    }

    private addFeatures(features: Array<Feature>): void {
        if (features == null) {
            return;
        }

        features.forEach((feat, index, feats) => {
            // console.log("idx: " + index);
            this.vectorSource.addFeature(feat);
        });
    }

    private async callAjaxData(url: string, id: number): Promise<any> {
        const ret = { "error": 1, "message": "Fehler - Abfrage nicht erfolgreich." };
        const dataset = await $.ajax({
            url: url,
            // crossDomain: true,
            type: "POST",
            dataType: "json",
            // beforeSend: function (xhrObj) {
            //     xhrObj.setRequestHeader("Content-Type", "application/json");
            // },
            contentType: "application/json; charset=utf-8",
            async: true, // entweder parameter oder default false
            data: JSON.stringify(id),
            // data: JSON.stringify({ "idProj": id }),
            // error: function (errorThrown) {
            //     // alert("AJAX fehlgeschlagen!");
            //     console.log("AJAX fehlgeschlagen!");
            //     // return ret;
            // }
        }).catch(() => { console.log("Catch Error"); return ret; });
        // .then((data) => {
        //     return data;
        // });

        return dataset;
    }

    private loader = (extent: ol.Extent, resolution: number, proj: ol.proj.Projection): void => {
        const url = "http://localhost:61000/api/feature/GetFeatures";
        // const daten = JSON.stringify({ "IdProj": 5, "Content": "Täßste" });
        (async () => {
            const feats = new Array<Feature>();
            const res = await this.callAjaxData(url, 18);
            // this.callAjaxData(url, 18).then( (res) => {
            if (res.error === 0) {
                const format = new WKT();
                res.data.features.forEach((feat) => {
                    const feature = format.readFeature(feat.wkt, {
                        dataProjection: "EPSG:4326",
                        featureProjection: "EPSG:3857"
                    });
                    if (feature) {
                        feature.setId(feat.Id);
                        feats.push(feature);
                    }
                });
                this.addFeatures(feats);
                // }}).catch(() => { console.log("Fehler"); });
            } else {
                console.log(res.message);
            }
        })();
        // console.log("Loader Call");
    }
}

export { KartenFeatures };



/*#region Features Point/Line/Polygon
var features = new ol.Collection();
var vectorSource = new ol.source.Vector({
    features: features,
    loader: function (extent, resolution, projection) {
        var url =  window.rootUrl + "Projekt/GetFeatures";
        var daten = { idProj: $("#IdProjekt").val() };
        $.ajax({
            url: url,
            type: 'POST',
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            async: true,
            data: JSON.stringify(daten),
            success: function (res) {
                if (res.error == 0) {
                    var format = new ol.format.WKT();
                    res.data.features.forEach(function (feat) {
                        var feature = format.readFeature(feat.Wkt, {
                            dataProjection: 'EPSG:4326',
                            featureProjection: 'EPSG:3857'
                        });
                        if (feature) {
                            feature.setId(feat.Id);
                            //console.log("id " + feature.getId());
                            vectorSource.addFeature(feature);
                        }
                    });
                }
            },
            error: function (errorThrown) {
                //alert("AJAX fehlgeschlagen!");
            }
        }).done(function (res) {
            //if (async || false)
            //asyncCallbacks(asyncCb, res);

        }).fail(function () {
            console.log("Aufruf fehlgeschlagen." + url);
            return false;
        });
    },
    strategy: ol.loadingstrategy.bbox
});

var vector = new ol.layer.Vector({
    source: vectorSource,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 0, 0, 0.1)'
        }),
        stroke: new ol.style.Stroke({
            color: '#ff0000',
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({
                color: '#ff0000'
            })
        })
    })
});
 */
