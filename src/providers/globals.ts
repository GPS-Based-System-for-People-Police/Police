import { Injectable } from '@angular/core';
import { Geoposition } from '@ionic-native/geolocation';

@Injectable()
export class Globals {


  /* CONSTANTS */
  public WEBSITE_URL = 'http://mabcoder.tk/insec/';


  public isMapLoadedFirstTime = 2;
  public userLocLongitude = 0;
  public userLocLatitude = 0;
  public userName = '';
  public userId='';
  public isHelpMarker=false;
  public position:Geoposition;

  constructor() {}

}
