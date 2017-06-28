import { Location } from '../../providers/location';
import { RootPagePage } from './../root-page/root-page';
import { Globals } from './../../providers/globals';
import { PostnewsPage } from './../postnews/postnews';
import { Notification, NotificationReader } from './../../providers/notification-reader';
import { Component } from '@angular/core';
import { NavController, NavParams, Tabs } from 'ionic-angular';
import { MapPage } from './../map/map';


@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
  providers: [MapPage]
})
export class NotificationPage {

  notes: any;
  notifications: Notification[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private reader: NotificationReader,
    private globals: Globals,
    private location: Location,
    private map: MapPage
  ) {
    this.location.getNotifications().then(res => {
      this.notes = res;
      console.log(res);
    }).catch(err => { });
    setInterval(() => {
      this.location.getNotifications().then(res => {
        this.notes = res;
        console.log(res);
      }).catch(err => { });
    }, 3000);
  }

  ionViewDidLoad() {
    this.notifications = [];
  }

  notificationSelected(notification: Notification) { }

  uploadNotification() {
    this.navCtrl.push(PostnewsPage);
    console.log("Uploading Notification");
  }

  jumpToUserLocation(note) {
    this.globals.userLocLatitude = note[1];
    this.globals.userLocLongitude = note[2];
    this.globals.userName = note[0];
    let tabs: Tabs = this.navCtrl.parent;
    tabs.select(1);
    this.map.addUserMarker(note[0], note[1], note[2], note[3]);
  }

}
