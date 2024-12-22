import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { ItemService } from 'src/app/services/item.service';
import { of } from 'rxjs';
import { Item } from 'src/app/models/item';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockItemService: jasmine.SpyObj<ItemService>;

  const mockItems: Item[] = [
    { id: 1, firstName: 'Item 1', lastName: ' last 1', email: 'mail 1' },
    { id: 2, firstName: 'Item 2', lastName: ' last 2', email: 'mail 2' },
    { id: 3, firstName: 'Item 3', lastName: ' last 3', email: 'mail 3' },
    { id: 4, firstName: 'Item 4', lastName: ' last 4', email: 'mail 4' },
    { id: 5, firstName: 'Item 5', lastName: ' last 5', email: 'mail 5' }
  ];

  beforeEach(async () => {
    mockItemService = jasmine.createSpyObj('ItemService', ['getItems']);
    mockItemService.getItems.and.returnValue(of(mockItems));

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: ItemService, useValue: mockItemService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load only first 4 items on init', () => {
    expect(component.items()).toHaveSize(4);
    expect(component.items()).toEqual(mockItems.slice(0, 4));
  });

  it('should set isLoading to false after items are loaded', () => {
    expect(component.isLoading()).toBeFalse();
  });

  it('should call getItems from ItemService', () => {
    expect(mockItemService.getItems).toHaveBeenCalled();
  });
});
