import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestInfoPage } from './request-info.page';

describe('RequestInfoPage', () => {
  let component: RequestInfoPage;
  let fixture: ComponentFixture<RequestInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestInfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
