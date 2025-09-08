import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Section1J } from './section1-j';

describe('Section1J', () => {
  let component: Section1J;
  let fixture: ComponentFixture<Section1J>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Section1J]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Section1J);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
