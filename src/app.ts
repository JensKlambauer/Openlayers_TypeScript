// import "ol/ol.css";
import * as $ from "jquery";
import { Karte } from "./MapService";
import { Searchresult } from "./OsmSearchresults";
import SearchService from "./SearchService";

console.log("Karte start!");
let map: Karte = null;
$(() => {
    console.log("Karte ready!");
    map = new Karte();
    map.initMap();
});


$("#ortsuchen").click(() => {
    const suchTxt = $("#suchText").val().toString();
    (async function () {
        const sucheService = new SearchService();
        const data = await sucheService.SucheOsmAdressen(suchTxt);
        addErgebnisLinks(data);
        refreshLinks();
    })();
});

$("#printMap").click(function () {
    // console.log("Karte export");
    map.printMap();
});

function addErgebnisLinks(osmresult?: Searchresult[]): void {
    // console.log(osmresult);
    $("#suchergebnisse").html("");
    if (!osmresult || osmresult.length === 0) {
        $("#suchergebnisse").html("<ul><li>Keine Ergebnisse gefunden!</li></ul>");
        return;
    }

    const ulElem = document.createElement("ul");
    // $("#suchergebnisse").html("<ul>");
    for (let res of osmresult) {
        const liElem = document.createElement("li");
        const linkElem = document.createElement("a");
        linkElem.id = res.osmId;
        linkElem.href = "#";
        linkElem.className = "jumptolonlat";
        linkElem.innerHTML = res.anzeigeTxt;
        linkElem.setAttribute("data-request-lon", res.lon);
        linkElem.setAttribute("data-request-lat", res.lat);
        liElem.appendChild(linkElem);
        ulElem.appendChild(liElem);
    }
    $("#suchergebnisse").append(ulElem);
}

function refreshLinks(): void {
    $(".jumptolonlat").click(function () {
        // console.log( $(this).attr("id"));
        const lon = parseFloat($(this).data("request-lon"));
        const lat = parseFloat($(this).attr("data-request-lat"));
        jumptolonlat(lon, lat);
    });
}

function jumptolonlat(lon?: number, lat?: number): boolean {
    if (lon && lat) {
        if (map.jumpToPosition(lon, lat)) {
            $("#suchergebnisse").html("");
            return true;
        }
    }

    // alert("Ergebnis ausserhalb " + lon + " / " + lat);
    return false;
}
