import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Globals } from './../../providers/globals';
import { RootPagePage } from './../root-page/root-page';
import { Component, ViewChild } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { Location, PoliceLocationInfo } from './../../providers/location';
import { LoginPage } from './../login/login';
import { App } from 'ionic-angular';
// import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { NavController, NavParams, Platform, Nav } from 'ionic-angular';

import {
  GoogleMaps,
  GoogleMapsAnimation,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  CameraPosition,
  MarkerOptions,
  Marker

} from '@ionic-native/google-maps';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  currentLocation: string = '';
  userName: string = '';
  visibleRegion: any;
  map: GoogleMap;
  position: Geoposition;
  @ViewChild(Nav) nav: Nav;
  policeMarkers: any[];
  userMarker: MarkerOptions;

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private geolocation: Geolocation,
    private googleMaps: GoogleMaps,
    private platform: Platform,
    private storage: Storage,
    private location: Location,
    private globals: Globals,
    private appCtrl: App,
    // private launchNavigator: LaunchNavigator
  ) {
    let res = this.getDistanceBetweenPoints({
      lat: 19.1592101,
      lng: 77.3351628
    }, {
        lat: 19.1892101,
        lng: 77.3551628
      }, 'km');

    console.log(res);


  }

  // Load map only after view is initialize
  ngAfterViewInit() {
    this.storage.get('authentication').then((val) => {
      if (val == null) {
        console.log('Authentication has not been set');
        console.log(val);
      } else {
        this.userName = val.userName;
        this.globals.userId = val.userName;
        this.globals.userName = val.userName;
        console.log(val);
      }
    });

    this.currentPosition();
  }

  currentPosition() {

    this.platform.ready().then(() => {
      // get current position
      this.geolocation.getCurrentPosition().then(pos => {
        console.log(pos);
        this.position = pos;
        this.globals.position = pos;
        this.currentLocation = pos.coords.latitude + ', ' + pos.coords.longitude;
        this.loadMap(null, null, null, null);

      });

      const watch = this.geolocation.watchPosition().subscribe(pos => {
        console.log(pos);
        this.position = pos;
        this.globals.position = pos;
        this.currentLocation = pos.coords.latitude + ', ' + pos.coords.longitude;
        this.location.setLoc(this.userName, pos.coords.longitude, pos.coords.latitude).then(res => {
          if (res.t == 's') {
            console.log(pos);
          } else {
            console.log('Failed');
          }
        }).catch(err => {
          console.log('Failed to load');
        });
      });

      // to stop watching
      //watch.unsubscribe();
      this.loadMap(null, null, null, null);


    });

  }


  loadMap(userName: string, lat: number, long: number, message: string) {

    // create a new map by passing HTMLElement
    let element: HTMLElement = document.getElementById('map');

    this.map = this.googleMaps.create(element);

    // listen to MAP_READY event
    // You must wait for this event to fire before adding something to the map or modifying it in anyway
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => this.currentLocation = 'Map is ready');
    this.map.clear();

    // This is not required, because we are capturing our current position manually by fab component
    this.map.setMyLocationEnabled(true);
    this.map.setCompassEnabled(true);
    this.map.setAllGesturesEnabled(true);

    this.map.getVisibleRegion().then(region => {
      this.visibleRegion = region.northeast + ' ' + region.southwest;
    });

    this.location.getLoc().then(res => {
      this.policeMarkers = res;
      res.forEach(element => {
        this.map.addMarker({
          position: new LatLng(element[2], element[1]),
          title: element[0],
          icon: {
            url: 'assets/icon/police.png'
          },
          animation: GoogleMapsAnimation.BOUNCE
        }).then((marker: Marker) => {
          marker.showInfoWindow();
        });
      });
    }
    );
    if (this.globals.isHelpMarker) {
      let markerOptions: MarkerOptions = {
        position: new LatLng(lat, long),
        title: userName,
        icon: 'blue',
        snippet: message,
        animation: GoogleMapsAnimation.BOUNCE
      };

      this.map.addMarker(markerOptions).then((marker: Marker) => {
        marker.showInfoWindow();
      });
      this.globals.isHelpMarker = false;

      // let options: LaunchNavigatorOptions = {
      //   start: 'London, ON',
      //   app: this.launchNavigator.APP.GOOGLE_MAPS
      // };

      // this.launchNavigator.navigate('Toronto, ON', options)
      //   .then(
      //   success => console.log('Launched navigator'),
      //   error => console.log('Error launching navigator', error)
      //   );

    }
    this.map.refreshLayout();
  }

  locateToCurrentPosition() {
    /* Focus on current position  */
    if (this.position != undefined) {
      this.map.moveCamera({
        target: new LatLng(this.position.coords.latitude, this.position.coords.longitude),
        zoom: 18,
        tilt: 30
      });
    }
  }

  logOut() {
    this.storage.ready().then(() => {
      this.storage.clear();
      this.appCtrl.getRootNav().setRoot(LoginPage);
    });
  }
  addUserMarker(userName: string, lat: number, long: number, message: string) {
    this.globals.isHelpMarker = true;
    this.loadMap(userName, lat, long, message);


    // this.userMarker=this.map.addMarker({
    //     position: new LatLng(lat, long),
    //     title: userName,
    //     icon: 'blue',
    //     animation: GoogleMapsAnimation.BOUNCE
    //   }).then((marker: Marker) => {
    //     marker.showInfoWindow();
    //   });
    // this.map.refreshLayout();
    // this.globals.isHelpMarker = false;
  }

  route() {

  }

  /* Haversine Formula */
  getDistanceBetweenPoints(start, end, units) {
    let earthRadius = {
      miles: 3958.8,
      km: 6371
    };
    let R = earthRadius[units || 'miles'];
    let lat1 = start.lat;
    let lon1 = start.lng;
    let lat2 = end.lat;
    let lon2 = end.lng;
    let dLat = this.toRad((lat2 - lat1));
    let dLon = this.toRad((lon2 - lon1));
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    return d;
  }

  toRad(x) {
    return x * Math.PI / 180;
  }

}
