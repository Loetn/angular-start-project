import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Http, Headers, Response, Jsonp, RequestOptions, ConnectionBackend } from "@angular/http";
import { Router } from "@angular/router"

@Injectable()
export class ConfigurationService {

    private config: Object;

    constructor(private http: Http) {
        
    }

    load(): Promise<any> {
        console.log("Reading _ConfigurationService ");
        return new Promise((resolve, reject) => {
            this.http.get("RelationManagement/assets/config/AppSettings.json")
                .map(res => res.json())
                .subscribe((data) => {
                    this.config = data;  
                    console.log(this.config);
                });
        });
        
    }

    get(key: any) {
        return this.config[key];
    }
};