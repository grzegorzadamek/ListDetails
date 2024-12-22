import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemDetailComponent } from './item-detail.component';
import { ItemService } from 'src/app/services/item.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

describe('ItemDetailComponent', () => {
  let component: ItemDetailComponent;
  let fixture: ComponentFixture<ItemDetailComponent>;
  let mockItemService: jasmine.SpyObj<ItemService>;
  let mockLocation: jasmine.SpyObj<Location>;

  const mockItem = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com'
  };

  beforeEach(async () => {
    mockItemService = jasmine.createSpyObj('ItemService', ['getItem', 'updateItem']);
    mockLocation = jasmine.createSpyObj('Location', ['back']);
    mockItemService.getItem.and.returnValue(of(mockItem));
    mockItemService.updateItem.and.returnValue(of(mockItem));

    await TestBed.configureTestingModule({
      imports: [ItemDetailComponent],
      providers: [
        FormBuilder,
        { provide: ItemService, useValue: mockItemService },
        { provide: Location, useValue: mockLocation },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load item details on init', () => {
    expect(mockItemService.getItem).toHaveBeenCalledWith(1);
    expect(component.userForm.get('firstName')?.value).toBe('John');
    expect(component.userForm.get('lastName')?.value).toBe('Doe');
    expect(component.userForm.get('email')?.value).toBe('john@example.com');
  });

  it('should update item and navigate back on form submission', () => {
    component.userForm.patchValue({
      id: 1,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com'
    });

    component.onSubmit();

    expect(mockItemService.updateItem).toHaveBeenCalled();
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });
});
