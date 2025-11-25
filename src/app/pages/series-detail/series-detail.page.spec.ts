import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeriesDetailPage } from './series-detail.page';

describe('SeriesDetailPage', () => {
  let component: SeriesDetailPage;
  let fixture: ComponentFixture<SeriesDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
