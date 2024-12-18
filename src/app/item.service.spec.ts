import { TestBed } from '@angular/core/testing';
import { ItemService } from './item.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MessageService } from './message.service';
import { Item } from './item';

describe('ItemService', () => {
  let service: ItemService;
  let httpMock: HttpTestingController;
  let messageService: jasmine.SpyObj<MessageService>;

  const baseUrl = 'https://node-listdetails.onrender.com';

  beforeEach(() => {
    messageService = jasmine.createSpyObj('MessageService', ['add']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ItemService,
        { provide: MessageService, useValue: messageService }
      ]
    });

    service = TestBed.inject(ItemService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getItems', () => {
    it('should return items array', () => {
      const mockItems: Item[] = [
        { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
        { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' }
      ];

      service.getItems().subscribe(items => {
        expect(items).toEqual(mockItems);
      });

      const req = httpMock.expectOne(`${baseUrl}/items`);
      expect(req.request.method).toBe('GET');
      req.flush(mockItems);
    });
  });

  describe('getItem', () => {
    it('should return a single item', () => {
      const mockItem: Item = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' };

      service.getItem(1).subscribe(item => {
        expect(item).toEqual(mockItem);
      });

      const req = httpMock.expectOne(`${baseUrl}/item/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockItem);
    });
  });

  describe('updateItem', () => {
    it('should update an item', () => {
      const mockItem: Item = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' };

      service.updateItem(mockItem).subscribe(response => {
        expect(response).toEqual(mockItem);
      });

      const req = httpMock.expectOne(`${baseUrl}/item`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockItem);
      req.flush(mockItem);
    });
  });

  describe('addItem', () => {
    it('should add a new item', () => {
      const newItem = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' };
      const mockResponse = { id: 1, ...newItem };

      service.addItem(newItem).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/item/add`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newItem);
      req.flush(mockResponse);
    });
  });

  describe('deleteItem', () => {
    it('should delete an item', () => {
      const mockItem: Item = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' };

      service.deleteItem(1).subscribe(response => {
        expect(response).toEqual(mockItem);
      });

      const req = httpMock.expectOne(`${baseUrl}/item/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockItem);
    });
  });

  describe('searchItems', () => {
    it('should return matching items', () => {
      const mockItems: Item[] = [
        { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
      ];
      const searchTerm = 'John';

      service.searchItems(searchTerm).subscribe(items => {
        expect(items).toEqual(mockItems);
      });

      const req = httpMock.expectOne(`${baseUrl}/items/?query=${searchTerm}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockItems);
    });

    it('should return empty array for empty search term', () => {
      service.searchItems('').subscribe(items => {
        expect(items).toEqual([]);
      });

      httpMock.expectNone(`${baseUrl}/items/?query=`);
    });
  });
});
