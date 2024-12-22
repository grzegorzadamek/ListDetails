import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemsComponent } from './items.component';
import { ItemService } from 'src/app/services/item.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Item } from 'src/app/models/item';

describe('ItemsComponent', () => {
  let component: ItemsComponent;
  let fixture: ComponentFixture<ItemsComponent>;
  let mockItemService: jasmine.SpyObj<ItemService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockItems: Item[] = [
    { id: 1, firstName: 'Item 1', lastName: 'last 1', email: 'mail 1' },
    { id: 2, firstName: 'Item 2', lastName: 'last 2', email: 'mail 2' },
    { id: 3, firstName: 'Item 3', lastName: 'last 3', email: 'mail 3' }
  ];

  beforeEach(async () => {
    mockItemService = jasmine.createSpyObj('ItemService', ['getItems', 'deleteItem']);
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);

    mockItemService.getItems.and.returnValue(of(mockItems));
    const deletedItem: Item = { id: 1, firstName: 'Deleted', lastName: 'Item', email: 'deleted@test.com' };
    mockItemService.deleteItem.and.returnValue(of(deletedItem));


    await TestBed.configureTestingModule({
      imports: [ItemsComponent],
      providers: [
        { provide: ItemService, useValue: mockItemService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load items on init', () => {
    expect(component.items()).toEqual(mockItems);
    expect(mockItemService.getItems).toHaveBeenCalled();
  });

  it('should set isLoading to false after items are loaded', () => {
    expect(component.isLoading()).toBeFalse();
  });

  it('should select item when onSelect is called', () => {
    const testItem = mockItems[0];
    component.onSelect(testItem);
    expect(component.selectedItem()).toEqual(testItem);
  });

  it('should compute total items correctly', () => {
    expect(component.totalItems()).toBe(mockItems.length);
  });

  it('should navigate to add page when addItem is called', () => {
    component.addItem();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/add');
  });

  it('should delete item and update list', () => {
    const itemToDelete = mockItems[0];
    component.deleteItem(itemToDelete);

    expect(mockItemService.deleteItem).toHaveBeenCalledWith(itemToDelete.id);
    expect(component.items().length).toBe(mockItems.length - 1);
    expect(component.items().includes(itemToDelete)).toBeFalse();
  });
});
