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

class KartenFeatures extends Vector {

    constructor(title: string) {
        let features = new Collection<Feature>();
        const options: olx.source.VectorOptions = {
            features: features,
            format: new GeoJSON(),
            strategy: ol.loadingstrategy.bbox,
        };
        const vs = new VectorSource(options);
        const style = new Style({
            fill: new Fill({color: "rgba(255, 0, 0, 0.0)"}),
            stroke: new Stroke({ color: "#0000ff", width: 1})
        });

        super({source: vs, visible: false, style: style });
        this.set("title", title);

        
    }

}



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
