import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Auth } from 'src/app/models/auth';
import { Product } from 'src/app/models/product';
import { CustomerService } from 'src/app/services/customer.service';
import { AuthService } from 'src/app/services/auth.service';
import { Customer } from 'src/app/models/customer';
import { SocketService } from 'src/app/services/socket/socket.service';

@Component({
  selector: 'app-wishlist-view',
  templateUrl: './wishlist-view.component.html',
  styleUrls: ['./wishlist-view.component.css'],
})
export class WishlistViewComponent implements OnInit {
  public wishlist: Product[] = [];
  public auth: Auth = {
    jwt: '',
    user: null,
  };
  constructor(
    private _customerService: CustomerService,
    private _socketService: SocketService,
    private _authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadAuth();
    this.getWishlist();

    this._socketService
      .on('updated-wishlist')
      .subscribe(async (response: any) => {
        await this.getWishlist();
      });
  }

  private loadAuth(): void {
    this.auth = this._authService.getUser();
  }

  private async getWishlist(): Promise<void> {
    const response = await lastValueFrom(
      this._customerService.getCustomerWishlist(this.auth.user._id),
    );

    if (!response.success) {
      alert(response.message);
      return;
    }

    this.wishlist = response.wishlist;
  }

  public async removeFromWishlist(productId: string): Promise<void> {
    const filtered = this.wishlist.filter(
      (product) => product._id !== productId,
    );
    let user = <Customer>this._authService.getUser().user;
    user.wishlist = [...filtered.map((p) => p._id)];
    const response = await lastValueFrom(
      this._customerService.editProfile(user._id || '', user),
    );

    if (!response.success) {
      alert('error updating wishlist');
      return;
    }

    // send socket
    this._socketService.emit('wishlist-changes', { wishlist: user.wishlist });
    this._authService.updateWishlist(filtered.map((p) => p._id));
    //update on local storage
    this.wishlist = [...filtered];
  }
}
