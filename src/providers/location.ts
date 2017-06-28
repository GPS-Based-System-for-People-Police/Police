import { Globals } from './globals';
import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Headers, RequestOptions, ResponseOptions } from '@angular/http';


export interface PoliceLocationInfo{
  id:string;
  latitude:string;
  langitude:string
}

@Injectable()
export class Location {

  private serverURL : string;

  constructor(
    public http: Http,
    private globals: Globals
  ) {
    this.serverURL = this.globals.WEBSITE_URL;
  }

  setLoc(userName: string, langt:number, lat:number) {
    this.http.post(this.serverURL + "test.php", null).subscribe(res => {
      console.log("Session"+res.text());
    });
    let data = new URLSearchParams();
    data.append('u', userName);
    data.append('lat', lat.toString());
    data.append('langt', langt.toString());
    return this.http.post(this.serverURL + "setLocation.php", data).map(res => res.json()).toPromise();
  }

  getLoc() {
    return this.http.post(this.serverURL + "getLocation.php", null).map(res => res.json()).toPromise();
  }

  getNotifications() {
    let data = new URLSearchParams();
    data.append('u', this.globals.userId);
    return this.http.post(this.serverURL + "getNotifications.php", data).map(res => res.json()).toPromise();
  }
}
