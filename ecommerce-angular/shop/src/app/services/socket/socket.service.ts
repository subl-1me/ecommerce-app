import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GLOBAL } from '../CONST';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService {
  public socket = io(`${environment.URL_LOCAL_SOCKETS}`, {
    transports: ['websocket'],
  });

  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  on<T>(event: string): Observable<T> {
    return new Observable((observer) => {
      this.socket.on(event, (data: T) => observer.next(data));
      return () => this.socket.off(event);
    });
  }
}
