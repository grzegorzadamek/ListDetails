import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ItemSearchComponent } from './item-search.component';
import { ItemService } from 'src/app/services/item.service';
import { of } from 'rxjs';
import { Item } from 'src/app/models/item';

describe('ItemSearchComponent', () => {
  let component: ItemSearchComponent;
  let fixture: ComponentFixture<ItemSearchComponent>;
  let mockItemService: jasmine.SpyObj<ItemService>;

  const mockItems: Item[] = [
    { id: 1, name: 'Item A', description: ' last 1' },
    { id: 2, name: 'Item B', description: ' last 2'}
  ];

  beforeEach(async () => {
    mockItemService = jasmine.createSpyObj('ItemService', ['searchItems']);
    mockItemService.searchItems.and.returnValue(of(mockItems));

    await TestBed.configureTestingModule({
      imports: [ItemSearchComponent],
      providers: [
        { provide: ItemService, useValue: mockItemService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize items$ observable', () => {
    expect(component.items$).toBeDefined();
  });

  it('should debounce search terms', fakeAsync(() => {
    // Perform multiple searches rapidly
    component.search('a');
    component.search('ab');
    component.search('abc');

    // Fast-forward time
    tick(300);

    // Verify that only the last search term was processed
    expect(mockItemService.searchItems).toHaveBeenCalledWith('abc');
    expect(mockItemService.searchItems).toHaveBeenCalledTimes(1);
  }));

  it('should not search with same term twice', fakeAsync(() => {
    component.search('test');
    tick(300);
    component.search('test');
    tick(300);

    expect(mockItemService.searchItems).toHaveBeenCalledWith('test');
    expect(mockItemService.searchItems).toHaveBeenCalledTimes(1);
  }));

  it('should switch to new search term', fakeAsync(() => {
    component.search('first');
    tick(300);
    component.search('second');
    tick(300);

    expect(mockItemService.searchItems).toHaveBeenCalledWith('first');
    expect(mockItemService.searchItems).toHaveBeenCalledWith('second');
    expect(mockItemService.searchItems).toHaveBeenCalledTimes(2);
  }));
});
