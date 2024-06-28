import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryExample } from './inventory-example.component';

describe('InventoryExample', () => {
  let component: InventoryExample;
  let fixture: ComponentFixture<InventoryExample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryExample],
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryExample);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
