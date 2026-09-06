import { Injectable } from '@angular/core';

// temp
interface Modal {
  elem: any;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  public activeModals: Modal[];

  constructor() {
    this.activeModals = [];
  }

  public addModal(modal: Modal): void {
    this.activeModals.push(modal);
  }

  public closeModal(modalName: string): void {
    console.log(this.activeModals);
    const modal = this.activeModals.find((modal) => modal.name === modalName);
    if (!modal) {
      return;
    }

    modal.elem.hide();
    this.activeModals = this.activeModals.filter(
      (modal) => modal.name !== modalName,
    );
  }

  public getActiveModals(): any[] {
    return this.activeModals;
  }
}
