import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { process } from 'uniqid';

// Models
import { Customer } from '../../../models/customer';

interface auxNote {
  tempId: string;
  text: string;
}

// Icons
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';

// Services
import { CustomersService } from 'src/app/services/customers.service';
import { IdentityService } from 'src/app/services/identity.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [CustomersService, IdentityService],
})
export class EditComponent implements OnInit {
  // Icons
  faAngleLeft = faAngleLeft;
  faPlus = faPlus;
  faSave = faSave;
  faTrashAlt = faTrashAlt;
  faRotateLeft = faRotateLeft;

  public customer: Customer;
  public token: any;
  public customerId: any;
  public responseStatus: string;
  public today: Date = new Date();
  public newNote: string;
  public notes: auxNote[];

  public selectedNotes: auxNote[];

  constructor(
    private _customerService: CustomersService,
    private _identityService: IdentityService,
    private _router: ActivatedRoute,
  ) {
    this.newNote = '';
    this.notes = [];
    this.selectedNotes = [];
    this.customer = { sub: 0, notes: [] };
    this.token = this._identityService.getToken();
    this.responseStatus = '';
  }

  ngOnInit(): void {
    this.customerId = this._router.snapshot.paramMap.get('id');

    this.getCustomer();
  }

  public resetForm(form: any) {
    if (confirm('Are you sure you want to reset all changes?')) {
      // Resetear a los valores originales
      this.customer = {
        sub: 0,
        names: 'John',
        surnames: 'Doe',
        email: 'john.doe@example.com',
        dni: 12345678,
        gender: 'Male',
        notes: [],
      };
      form.reset();
      // Reactivar validación
      Object.keys(form.controls).forEach((key) => {
        form.controls[key].markAsPristine();
      });
    }
  }

  public selectNoteToRemove(note: auxNote): void {
    this.selectedNotes.push(note);
    this.addRemovingStyles(note.tempId);
  }

  private addRemovingStyles(noteId: string): void {
    const noteElem = document.getElementById(`note-item-${noteId}`);
    if (!noteElem) {
      return;
    }

    noteElem.classList.add('text-decoration-line-through');
  }

  private delRemovingStyles(noteId: string): void {
    const noteElem = document.getElementById(`note-item-${noteId}`);
    if (!noteElem) {
      return;
    }

    noteElem.classList.remove('text-decoration-line-through');
  }

  public isNoteSelected(noteId: string): boolean {
    return this.selectedNotes.find((note) => note.tempId === noteId)
      ? true
      : false;
  }

  public getCustomer(): void {
    this._customerService
      .listById(this.token, this.customerId)
      .subscribe((response) => {
        this.customer = response.customer;
        this.loadAuxNotes();
      });
  }

  public resetNote(noteId: string): void {
    this.selectedNotes = this.selectedNotes.filter(
      (note) => note.tempId !== noteId,
    );
    this.delRemovingStyles(noteId);
  }

  private loadAuxNotes(): void {
    if (this.customer.notes) {
      this.notes = this.customer.notes?.map((note) => {
        return {
          tempId: process(), // generate uniqid
          text: note,
        } as auxNote;
      });
    }
  }

  public processNotes(): string[] | boolean {
    if (!this.customer.notes) {
      return false;
    }

    // filter removed notes
    const newNotes = this.customer.notes.filter((note) => {
      const trimmedNote = note?.trim();
      if (!trimmedNote) {
        return false;
      }

      const isSelected = this.selectedNotes.some((nt) => nt.text === note);
      return !isSelected;
    });

    if (this.newNote !== '') {
      newNotes?.push(this.newNote);
    }

    return newNotes;
  }
  public edit(form: any): void {
    const updatedNotes = this.processNotes();
    if (updatedNotes) {
      this.customer.notes = <string[]>updatedNotes;
    }
    this._customerService
      .edit(this.customer, this.token, this.customerId)
      .subscribe((response) => {
        if (response.status == 'success') {
          this.responseStatus = response.status;
          this.loadAuxNotes();
          this.newNote = '';
        } else {
          this.responseStatus = response.status;
        }
      });
  }
}
