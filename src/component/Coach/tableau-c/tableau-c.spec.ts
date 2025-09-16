import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableauC } from './tableau-c';

describe('TableauC', () => {
  let component: TableauC;
  let fixture: ComponentFixture<TableauC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableauC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableauC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
