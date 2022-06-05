import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileListGroupComponent } from './profile-list-group.component';

describe('ProfileListGroupComponent', () => {
  let component: ProfileListGroupComponent;
  let fixture: ComponentFixture<ProfileListGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileListGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileListGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
