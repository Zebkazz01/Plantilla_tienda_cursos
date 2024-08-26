import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-and-register',
  templateUrl: './login-and-register.component.html',
  styleUrls: ['./login-and-register.component.css']
})
export class LoginAndRegisterComponent {

  email_login:string = '';
  password_login:string = '';

  email_register:string = '';
  password_register:string = '';
  password_confirmation:string = '';
  name_register:string = '';
  surname_register:string = '';

  constructor(
    public authService: AuthService,
    public router: Router,
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(this.authService.user);
    if(this.authService.user){
      this.router.navigateByUrl("/");
    }
  }


  login(){
    if(!this.email_login || !this.password_login){
      alert("NO PUEDES INGRESAR AL SISTEMA SINO LLENAS TODOS LOS CAMPOS");
      return;
    }
    this.authService.login(this.email_login,this.password_login).subscribe((resp:any) => {
      console.log(resp);
      if(resp){
        window.location.reload();
      }else{
        alert("LAS CREDENCIALES INGRESADAS SON INCORRECTAS");
      }
    })
  }

  register(){
    if(!this.email_register || !this.password_register || !this.password_confirmation || !this.name_register
      || !this.surname_register){
      alert("NO PUEDES REGISTRAR UN USUARIO SINO LLENAS TODOS LOS CAMPOS");
      return;
    }

    if(this.password_register != this.password_confirmation){
      alert("LAS CONTRASEÑAS NO SON IGUALES");
      return;
    }

    let data = {
      email: this.email_register,
      password: this.password_register,
      name: this.name_register,
      surname:this.surname_register,
      rol: 'cliente',
    }

    this.authService.register(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        alert(resp.message_text);
      }else{
        this.email_register = '';
        this.password_register = '';
        this.name_register = '';
        this.surname_register = '';
        this.password_confirmation = '';
        alert("EL USUARIO SE CREO CORRECTAMENTE");
      }
    })
  }
}
