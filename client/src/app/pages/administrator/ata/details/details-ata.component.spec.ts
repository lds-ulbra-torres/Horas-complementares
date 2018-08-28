import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsAtaComponent } from './details-ata.component';

describe('DetailsAtaComponent', () => {
  let component: DetailsAtaComponent;
  let fixture: ComponentFixture<DetailsAtaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsAtaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsAtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
