import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuHamburger1 } from './menu-hamburger1';

describe('MenuHamburger1', () => {
  let component: MenuHamburger1;
  let fixture: ComponentFixture<MenuHamburger1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuHamburger1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuHamburger1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
