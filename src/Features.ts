import Vector from "ol/layer/vector";
import VectorSource from "ol/source/vector";
import GeoJSON from "ol/format/geojson";
import Style from "ol/style/style";
import Fill from "ol/style/fill";
import Stroke from "ol/style/stroke";
import TileLayer from "ol/layer/tile";
import TileWMS from "ol/source/tilewms";
import Collection from "ol/collection";
import Feature from "ol/feature";
import WKT from "ol/format/wkt";
import ls from "ol/loadingstrategy";
import * as $ from "jquery";

class KartenFeatures extends Vector {
    private vectorSource: VectorSource;

    constructor(title: string) {
        super();
        this.set("title", title);
        this.setVisible(false);

        let features = new Collection<Feature>();
        const options: olx.source.VectorOptions = {
            features: features,
            format: new GeoJSON(),
            strategy: ls.bbox,
        };

        let loader = (extent, resolution, projection) => {
            const url = "http://localhost:52000/Projekt/GetFeatures";
            // const date = JSON.stringify({ "IdProj": 5, "Content": "Täßste" });
            const feats = new Array<Feature>();
            let res = this.callAjaxData(url, 18);
            if (res.error === 0) {
                const format = new WKT();
                res.data.features.forEach((feat) => {
                    const feature = format.readFeature(feat.Wkt, {
                        dataProjection: "EPSG:4326",
                        featureProjection: "EPSG:3857"
                    });
                    if (feature) {
                        feature.setId(feat.Id);
                        feats.push(feature);
                    }
                });
                this.addFeatures(feats);
            }
        };
        options.loader = loader;
        this.vectorSource = new VectorSource(options);
        this.setSource(this.vectorSource);
        const style = new Style({
            fill: new Fill({ color: "rgba(255, 0, 0, 0.0)" }),
            stroke: new Stroke({ color: "#0000ff", width: 2 })
        });
        this.setStyle(style);
        // super({source: vectorSource, visible: false, style: style });
    }

    private addFeatures(features: Array<Feature>): void {
        if (features == null) {
            return;
        }

        features.forEach(feat => {
            this.vectorSource.addFeature(feat);
        });
    }

    private callAjaxData(url: string, id: number): any {
        let ret = { "error": 1 };
        $.ajax({
            url: url,
            type: "POST",
            dataType: "json",
            // contentType: "application/json; charset=utf-8",
            async: false, // entweder parameter oder default false
            data: { "IdProj": id },
            success: function (res) {
                ret = res;
            },
            error: function (errorThrown) {
                alert("AJAX fehlgeschlagen!");
            }
        }).done(function (res) {
            // if (async || false)
            // asyncCallbacks(asyncCb, res);
        }).fail(function () {
            console.log("Aufruf fehlgeschlagen." + url);
            return false;
        });

        return ret;
    }

    // private loader (extent, resolution, projection): void  {
    //     let vs = this.vectorSource;
    //     const url = "http://localhost:52000/Projekt/GetFeatures";
    //     const daten = JSON.stringify({ "IdProj": 5, "Content": "Täßste" });
    //     $.ajax({
    //         url: url,
    //         type: "POST",
    //         dataType: "json",
    //         // contentType: "application/json; charset=utf-8",
    //         // async: true,
    //         data: { "IdProj": 18 },
    //         success: function (res) {
    //             if (res.error === 0) {
    //                 const format = new WKT();
    //                 res.data.features.forEach(function (feat) {
    //                     const feature = format.readFeature(feat.Wkt, {
    //                         dataProjection: "EPSG:4326",
    //                         featureProjection: "EPSG:3857"
    //                     });
    //                     if (feature) {
    //                         feature.setId(feat.Id);
    //                         console.log("id " + feature.getId());
    //                         vs.addFeature(feature);
    //                     }
    //                 });
    //             }
    //         },
    //         error: function (errorThrown) {
    //             alert("AJAX fehlgeschlagen! Error");
    //         }
    //     }).done(function (res) {
    //         // alert("AJAX Done!");
    //     }).fail(function () {
    //         // alert("Aufruf fehlgeschlagen. Fail");
    //         console.log("Aufruf fehlgeschlagen. Fail");
    //     });
    // }
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
