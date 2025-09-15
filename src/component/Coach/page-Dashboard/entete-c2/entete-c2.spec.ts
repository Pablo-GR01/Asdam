import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnteteC2 } from './entete-c2';

describe('EnteteC2', () => {
  let component: EnteteC2;
  let fixture: ComponentFixture<EnteteC2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnteteC2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnteteC2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
