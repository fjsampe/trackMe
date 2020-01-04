import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsListPage } from './requests-list.page';

describe('RequestsListPage', () => {
  let component: RequestsListPage;
  let fixture: ComponentFixture<RequestsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestsListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
