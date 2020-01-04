import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestCommentsPage } from './request-comments.page';

describe('RequestCommentsPage', () => {
  let component: RequestCommentsPage;
  let fixture: ComponentFixture<RequestCommentsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestCommentsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestCommentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
