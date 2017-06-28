import { Globals } from '../../providers/globals';
import { RootPagePage } from './../root-page/root-page';
import { Authenticator } from './../../providers/authenticator';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';



@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  userName: string = '';
  password: string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private auth: Authenticator,
    private storage: Storage,
    private alertCtrl: AlertController,
    private globals:Globals
  ) {
    storage.get('authentication').then((val) => {
      if (val == null) {
        console.log('Authentication has not been set')
      } else {
        this.userName = val.userName;
        this.password = val.password;
        this.globals.userId=val.userName;
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {
    this.auth.login(this.userName, this.password,"p").then(res => {
      if (res.t == 's') {
        this.storage.ready().then(() => {
          this.storage.set('authentication', { userName: this.userName, password: this.password });
          this.navCtrl.setRoot(RootPagePage);
        });
      } else {
        console.log('Failed');
        let alert = this.alertCtrl.create({
          title: 'Failed',
          subTitle: 'User name or password may wrong...!',
          buttons: ['OK']
        });
        alert.present();
      }
    }).catch(err => {
      console.log("Login Failed")
    });
  }

  register() {
    let alert = this.alertCtrl.create({
      title: 'register',
      subTitle: 'In process...!',
      buttons: ['OK']
    });
    alert.present();
  }

  forgotPass(){
    let alert = this.alertCtrl.create({
      title: 'Reset Password',
      subTitle: 'Password reset link has been sebt to your email...!',
      buttons: ['OK']
    });
    alert.present();
  }

}
