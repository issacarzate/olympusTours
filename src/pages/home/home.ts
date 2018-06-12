import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Credenciales, UsuarioProvider} from "../../providers/usuario/usuario";

import { AngularFireAuth } from 'angularfire2/auth';
import {LoginPage} from "../login/login";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user: Credenciales = {};

  constructor(public navCtrl: NavController, public usuarioProv: UsuarioProvider, private AFauth: AngularFireAuth) {

    console.log(this.usuarioProv.usuario);
    this.user = this.usuarioProv.usuario;

    //Chaecar el estado de autenticacion del usaurio
    this.AFauth.authState.subscribe( user => {
      console.log("AFAuth!!!");
      console.log(JSON.stringify(user));
    });

  }

  salir(){
    this.AFauth.auth.signOut().then( res => {
      this.usuarioProv.usuario = {};
      this.navCtrl.setRoot(LoginPage);
    });
  }

}
