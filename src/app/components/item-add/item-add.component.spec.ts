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
    component.updateName('');
    expect(component.isNameValid()).toBeFalse();

    component.updateName('A');
    expect(component.isNameValid()).toBeFalse();

    component.updateName('John');
    expect(component.isNameValid()).toBeTrue();

    component.updateName('A'.repeat(51));
    expect(component.isNameValid()).toBeFalse();
  });

  it('should validate last name correctly', () => {
    component.updateName('');
    expect(component.isNameValid()).toBeFalse();

    component.updateName('B');
    expect(component.isNameValid()).toBeFalse();

    component.updateName('Smith');
    expect(component.isNameValid()).toBeTrue();

    component.updateName('B'.repeat(51));
    expect(component.isNameValid()).toBeFalse();
  });

  it('should update form values correctly', () => {
    component.updateName('John');
    component.updateDescription('Doe');

    expect(component.name()).toBe('John');
    expect(component.description()).toBe('Doe');
  });

  it('should call location.back when goBack is called', () => {
    component.goBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should submit form when valid', () => {
    component.updateName('John');
    component.updateDescription('Doe');

    component.onSubmit();

    expect(mockItemService.addItem).toHaveBeenCalledWith({
      name: 'John',
      description: 'Doe'
    });
  });

  it('should not submit form when invalid', () => {
    component.updateName('');
    component.updateDescription('');

    component.onSubmit();

    expect(mockItemService.addItem).not.toHaveBeenCalled();
  });
});
