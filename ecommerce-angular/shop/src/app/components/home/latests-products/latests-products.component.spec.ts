import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestsProductsComponent } from './latests-products.component';

describe('LatestsProductsComponent', () => {
  let component: LatestsProductsComponent;
  let fixture: ComponentFixture<LatestsProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LatestsProductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestsProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
