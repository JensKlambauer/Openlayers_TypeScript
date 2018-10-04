import { IOsmSearchresult, Searchresult } from "./OsmSearchresults";
import "whatwg-fetch";
import {JsonConvert, OperationMode, ValueCheckingMode} from "json2typescript";

interface ISearchService {
    SucheOsmAdressen: (suchtext: string) => Promise<Array<Searchresult>>;
}

class SearchService implements ISearchService {

    private url: string;
    constructor() {
        this.url = "https://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=de&addressdetails=1&q=";
    }

    public async SucheOsmAdressen(suchtext: string): Promise<Array<Searchresult>> {
        if (!suchtext || suchtext === "") {
            return;
        }

        const getReq = await window.fetch(this.url + suchtext);
        const data = await getReq.json();

        // const data = await WebRequest.json<any>(this.url + suchtext).catch((err) => console.log(err) );
        if (data) {
            let jsonConvert: JsonConvert = new JsonConvert();
            // jsonConvert.operationMode = OperationMode.LOGGING; // print some debug data
            // const res = data.map(obj =>  jsonConvert.deserialize(obj, Searchresult))
            const res = jsonConvert.deserializeArray(data, Searchresult);
            return res;
        }

        return;
    }
}

export default SearchService;
