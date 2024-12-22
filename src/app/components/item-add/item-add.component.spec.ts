import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemAddComponent } from './item-add.component';
import { ItemService } from 'src/app/services/item.service';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('ItemAddComponent', () => {
  let component: ItemAddComponent;
  let fixture: ComponentFixture<ItemAddComponent>;
  let mockItemService: jasmine.SpyObj<ItemService>;
  let mockLocation: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    mockItemService = jasmine.createSpyObj('ItemService', ['addItem']);
    mockLocation = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      imports: [ItemAddComponent, FormsModule],
      providers: [
        { provide: ItemService, useValue: mockItemService },
        { provide: Location, useValue: mockLocation }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate first name correctly', () => {
    component.updateFirstName('');
    expect(component.isFirstNameValid()).toBeFalse();

    component.updateFirstName('A');
    expect(component.isFirstNameValid()).toBeFalse();

    component.updateFirstName('John');
    expect(component.isFirstNameValid()).toBeTrue();

    component.updateFirstName('A'.repeat(51));
    expect(component.isFirstNameValid()).toBeFalse();
  });

  it('should validate last name correctly', () => {
    component.updateLastName('');
    expect(component.isLastNameValid()).toBeFalse();

    component.updateLastName('B');
    expect(component.isLastNameValid()).toBeFalse();

    component.updateLastName('Smith');
    expect(component.isLastNameValid()).toBeTrue();

    component.updateLastName('B'.repeat(51));
    expect(component.isLastNameValid()).toBeFalse();
  });

  it('should update form values correctly', () => {
    component.updateFirstName('John');
    component.updateLastName('Doe');
    component.updateEmail('john@example.com');

    expect(component.firstName()).toBe('John');
    expect(component.lastName()).toBe('Doe');
    expect(component.email()).toBe('john@example.com');
  });

  it('should call location.back when goBack is called', () => {
    component.goBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should submit form when valid', () => {
    component.updateFirstName('John');
    component.updateLastName('Doe');
    component.updateEmail('john@example.com');

    component.onSubmit();

    expect(mockItemService.addItem).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe'
    });
  });

  it('should not submit form when invalid', () => {
    component.updateFirstName('');
    component.updateLastName('');
    component.updateEmail('test@email.com');

    component.onSubmit();

    expect(mockItemService.addItem).not.toHaveBeenCalled();
  });
});
