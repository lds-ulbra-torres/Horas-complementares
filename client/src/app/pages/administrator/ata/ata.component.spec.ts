import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtaComponent } from './ata.component';

describe('AtaComponent', () => {
  let component: AtaComponent;
  let fixture: ComponentFixture<AtaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
