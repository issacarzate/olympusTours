import { Component } from '@angular/core';
import {ActionSheetController, IonicPage, NavController, NavParams} from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {UsuarioProvider} from "../../providers/usuario/usuario";
import {HomePage} from "../home/home";
import {IntroPage} from "../intro/intro";

import { Platform } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private afAuth: AngularFireAuth,
              public storage: Storage,
              public actionSheetCtrl: ActionSheetController,
              public usuarioProv: UsuarioProvider, private fb: Facebook, private platform: Platform) {
  }

  ionViewDidLoad(){
    this.storage.get('intro-done').then(done => {
      if (!done) {
        this.storage.set('intro-done', true);
        this.navCtrl.setRoot(IntroPage);
      }
    });
  }

  signInWithFacebook() {
    if (this.platform.is('cordova')) {
      this.fb.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        firebase.auth().signInWithCredential(facebookCredential).then(
          user => {
            console.log(user);
            this.usuarioProv.cargarUsuario(
              user.displayName,
              user.email,
              user.photoURL,
              user.uid,
              'facebook'
            );
            this.navCtrl.setRoot(HomePage);
          }).catch(e => console.log("Error con el login" + JSON.stringify(e)));
      });
    }else{
      this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(res => {
          console.log(res);
          let user = res.user;
          this.usuarioProv.cargarUsuario(
            user.displayName,
            user.email,
            user.photoURL,
            user.uid,
            'facebook'
          );

          this.navCtrl.setRoot(HomePage);

        });
    }

  }

  signOut() {
    this.afAuth.auth.signOut();
  }

  callWhats(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Contáctanos',
      buttons: [
        {
          text: 'Whatsapp',
          handler: () => {
            console.log('Destructive clicked');
          }
        },
        {
          text: 'Llamar',
          handler: () => {
            console.log('Archive clicked');
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

}
