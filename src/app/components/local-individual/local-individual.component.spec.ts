import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalIndividualComponent } from './local-individual.component';

describe('LocalIndividualComponent', () => {
  let component: LocalIndividualComponent;
  let fixture: ComponentFixture<LocalIndividualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalIndividualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
