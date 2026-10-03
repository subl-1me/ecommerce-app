import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Cart } from '../../models/cart';
import { CartService } from '../../services/cart.service';

import { Auth } from 'src/app/models/auth';
import { AuthService } from 'src/app/services/auth.service';
import { io } from 'socket.io-client';

// Icons
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { GLOBAL } from 'src/app/services/CONST';
import { environment } from 'src/environments/environment';
import { SocketService } from 'src/app/services/socket/socket.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.css'],
  providers: [CartService, AuthService, SocketService],
})
export class CartModalComponent implements OnInit {
  @Output() closeCartModal = new EventEmitter<boolean>();

  faXmark = faXmark;
  faCreditCard = faCreditCard;
  faTrash = faTrash;

  public cart: Cart;
  public customerID: any;
  public auth: Auth;

  public totalToPay: number = 0;

  constructor(
    private _cartService: CartService,
    private _authService: AuthService,
    private _socketService: SocketService,
  ) {
    this.cart = {
      items: [],
    };
    this.auth = {
      user: {
        cart: {
          _id: '',
          items: [],
        },
      },
      jwt: '',
    };
    this.customerID = localStorage.getItem('_id');
  }

  ngOnInit(): void {
    this.getCart();
    this.getAuth();
  }

  private getAuth(): void {
    this.auth = this._authService.getUser();
  }

  public async getCart(): Promise<void> {
    if (!this._authService.isAuthenticated()) {
      return;
    }

    const cart = this.auth.user.cart;
    const response = await lastValueFrom(this._cartService.getCart(cart._id));
    if (!response.success) {
      alert(response.message);
      return;
    }
    console.log(response.cart);
    this.cart = response.cart;
    console.log(this.cart);
  }

  public async deleteProductFromCart(productId: string): Promise<void> {
    const response = await lastValueFrom(
      this._cartService.removeItem(this.auth.user.cart._id, productId),
    );

    if (!response.success) {
      alert(response.message);
      return;
    }

    console.log(response);

    // socket
  }

  closeModal(): void {
    var modal = document.getElementById('modal');
    modal?.classList.add('modalGoAway');
    this.closeCartModal.emit(false);
  }
}
