import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Cart } from '../../models/cart';
import { CartService } from '../../services/cart.service';

import { io } from 'socket.io-client';

// Icons
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.css'],
  providers: [ CartService ]
})
export class CartModalComponent implements OnInit {

  // Socket
  public socket = io('http://localhost:4201');

  @Output() closeCartModal = new EventEmitter<boolean>();

  faXmark = faXmark;
  faCreditCard = faCreditCard;
  faTrash = faTrash;

  public cart: Array<Cart>;
  public customerID: any;

  public totalToPay: number = 0;

  constructor(
    private _cartService: CartService
  ) { 
    this.cart = [];
    this.customerID = localStorage.getItem('_id');
  }

  ngOnInit(): void {
    this.getCart();
    const self = this;
    this.socket.on('deleteProductCart', function(data:any){
      self.getCart();
    }.bind(self));
  }

  getCart():void{
    this._cartService.getCart(this.customerID).subscribe((response) => {
      if(!response.cart) return;

      this.cart = response.cart;
      for(let item of this.cart){
        if(item.product?.price){
          this.totalToPay += item.product?.price;
        }
      }
    })
  }

  deleteProductCart(_id:string):void{
    this._cartService.removeProductCart(_id).subscribe((response) => {
      console.log(response);
      this.socket.emit('deleteProductCart', {data: this.customerID})
    })
  }

  closeModal():void{
    var modal = document.getElementById('modal');
    modal?.classList.add('modalGoAway');

    setTimeout(() => {
      this.closeCartModal.emit(false);
    }, 1000)
  }

}
