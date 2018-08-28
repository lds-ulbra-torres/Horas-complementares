import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAtaComponent } from './create-ata.component';

describe('CreateAtaComponent', () => {
  let component: CreateAtaComponent;
  let fixture: ComponentFixture<CreateAtaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAtaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
