import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuHamburger2 } from './menu-hamburger2';

describe('MenuHamburger2', () => {
  let component: MenuHamburger2;
  let fixture: ComponentFixture<MenuHamburger2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuHamburger2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuHamburger2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
