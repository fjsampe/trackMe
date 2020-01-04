import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestMapPage } from './request-map.page';

describe('RequestMapPage', () => {
  let component: RequestMapPage;
  let fixture: ComponentFixture<RequestMapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestMapPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
