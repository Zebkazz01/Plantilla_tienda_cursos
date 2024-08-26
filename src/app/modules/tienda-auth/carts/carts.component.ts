import { Component, ElementRef, ViewChild } from '@angular/core';
import { CartService } from '../../home/service/cart.service';
import { Toaster } from 'ngx-toast-notifications';
import { TiendaAuthService } from '../service/tienda-auth.service';

declare var paypal:any;

@Component({
  selector: 'app-carts',
  templateUrl: './carts.component.html',
  styleUrls: ['./carts.component.css']
})
export class CartsComponent {

  CARTS:any = [];
  TOTAL_SUM:number = 0;
  code:any = null;

  @ViewChild('paypal',{static: true}) paypalElement?: ElementRef;
  constructor(
    public cartService: CartService,
    public tiendaAuthService: TiendaAuthService,
    public toaster: Toaster,
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.cartService.currentData$.subscribe((resp:any) => {
      console.log(resp);
      this.CARTS = resp;
      this.TOTAL_SUM = this.CARTS.reduce((sum:number,item:any) => sum + parseFloat(item.total),0);
    })

    paypal.Buttons({
      // optional styling for buttons
      // https://developer.paypal.com/docs/checkout/standard/customize/buttons-style-guide/
      style: {
        color: "gold",
        shape: "rect",
        layout: "vertical"
      },

      // set up the transaction
      createOrder: (data:any, actions:any) => {
          // pass in any options from the v2 orders create call:
          // https://developer.paypal.com/api/orders/v2/#orders-create-request-body
          if(this.TOTAL_SUM == 0){
            this.toaster.open({text: 'PARA PROCESAR EL PAGO EL MONTO TIENE QUE SER MAYOR A 0',caption: 'VALIDACION',type: 'warning'});
            return false;
          }
          if(this.CARTS.length == 0){
            this.toaster.open({text: 'PARA PROCESAR EL PAGO EL CARRITO TIENE QUE TENER AL MENOS 1 ITEM',caption: 'VALIDACION',type: 'warning'});
            return false;
          }
          const createOrderPayload = {
            purchase_units: [
              {
                amount: {
                    description: "COMPRAR POR EL LMS",
                    value: this.TOTAL_SUM
                }
              }
            ]
          };

          return actions.order.create(createOrderPayload);
      },

      // finalize the transaction
      onApprove: async (data:any, actions:any) => {
          
          let Order = await actions.order.capture();
            // Order.purchase_units[0].payments.captures[0].id
          let dataOrder = {
            method_payment: "PAYPAL",
            currency_total: "USD",
            currency_payment: "USD",
            total: this.TOTAL_SUM,
            n_transaccion:  Order.purchase_units[0].payments.captures[0].id,
          };
          this.tiendaAuthService.registerOrder(dataOrder).subscribe((resp:any) => {
            console.log(resp);
          })
          // return actions.order.capture().then(captureOrderHandler);
      },

      // handle unrecoverable errors
      onError: (err:any) => {
          console.error('An error prevented the buyer from checking out with PayPal');
      }
  }).render(this.paypalElement?.nativeElement);
  }
  getNameCampaign(campaign_discount:number){
    let NAME = "";
    if(campaign_discount == 1){
      NAME = "CAMPAÑA DE DESCUENTO NORMAL";
    }
    if(campaign_discount == 2){
      NAME = "CAMPAÑA DE DESCUENTO FLASH";
    }
    if(campaign_discount == 3){
      NAME = "CAMPAÑA DE DESCUENTO BANNER";
    }
    return NAME;
  }
  removeItem(CART:any){
    this.cartService.deleteCart(CART._id).subscribe((resp:any) => {
      this.cartService.removeItemCart(CART);
    })
  }

  applyCupon(){
    if(!this.code){
      this.toaster.open({text: 'DEBES INGRESAR UN CODIGO DE CUPON', caption: 'VALIDACION',type: 'danger'});
      return ;
    }
    let data = {
      cupon: this.code,
    }
    this.cartService.applyCupon(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toaster.open({text: resp.message_text, caption: 'VALIDACION',type: 'danger'});
      }else{
        this.cartService.resetCart();
        setTimeout(() => {
          this.code = null;
          resp.carts.forEach((cart:any) => {
            this.cartService.addCart(cart);
          });
        }, 50);
        this.toaster.open({text: resp.message_text, caption: 'VALIDACION',type: 'success'});
      }
    })
  }
}
