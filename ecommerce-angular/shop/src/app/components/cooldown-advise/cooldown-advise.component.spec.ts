import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CooldownAdviseComponent } from './cooldown-advise.component';

describe('CooldownAdviseComponent', () => {
  let component: CooldownAdviseComponent;
  let fixture: ComponentFixture<CooldownAdviseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CooldownAdviseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CooldownAdviseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
