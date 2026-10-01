import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryShowerComponent } from './category-shower.component';

describe('CategoryShowerComponent', () => {
  let component: CategoryShowerComponent;
  let fixture: ComponentFixture<CategoryShowerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryShowerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryShowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
