import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ItemService } from './item.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MessageService } from 'src/app/services/message.service';
import { Item } from 'src/app/models/item';

describe('ItemService', () => {
  let service: ItemService;
  let httpMock: HttpTestingController;
  let messageService: jasmine.SpyObj<MessageService>;
  const baseUrl = 'https://node-listdetails.onrender.com';

  beforeEach(() => {
    // Create spy for MessageService
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
    // Verify that no unmatched requests are outstanding
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getItems', () => {
    it('should return items array and log a message', () => {
      const mockItems: Item[] = [
        { id: 1, name: 'John', description: 'Doe' },
        { id: 2, name: 'Jane', description: 'Smith' }
      ];

      service.getItems().subscribe(items => {
        expect(items).toEqual(mockItems);
        expect(messageService.add).toHaveBeenCalledWith('ItemService: fetched items');
      });

      const req = httpMock.expectOne(`${baseUrl}/items`);
      expect(req.request.method).toBe('GET');
      req.flush(mockItems);
    });

    it('should handle errors when fetching items', () => {
      service.getItems().subscribe({
        next: () => fail('Should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(messageService.add).toHaveBeenCalledWith('ItemService: getItems failed: Http failure response for https://node-listdetails.onrender.com/items: 404 Not Found');
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/items`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getItem', () => {
    it('should return a single item and log a message', () => {
      const mockItem: Item = { id: 1, name: 'John', description: 'Doe'};

      service.getItem(1).subscribe(item => {
        expect(item).toEqual(mockItem);
        expect(messageService.add).toHaveBeenCalledWith(`ItemService: fetched item id=${1}`);
      });

      const req = httpMock.expectOne(`${baseUrl}/item/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockItem);
    });

    it('should handle errors when fetching a single item', () => {
      service.getItem(999).subscribe({
        next: () => fail('Should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(messageService.add).toHaveBeenCalledWith('ItemService: getItem id=999 failed: Http failure response for https://node-listdetails.onrender.com/item/999: 404 Not Found');
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/item/999`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('updateItem', () => {
    it('should update an item and log a message', () => {
      const mockItem: Item = { id: 1, name: 'John', description: 'Doe' };

      service.updateItem(mockItem).subscribe(response => {
        expect(response).toEqual(mockItem);
        expect(messageService.add).toHaveBeenCalledWith(`ItemService: updated item id=${mockItem.id}`);
      });

      const req = httpMock.expectOne(`${baseUrl}/item`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockItem);
      req.flush(mockItem);
    });

    it('should handle errors when updating an item', () => {
      const mockItem: Item = { id: 1, name: 'John', description: 'Doe' };

      service.updateItem(mockItem).subscribe({
        next: () => fail('Should have failed with server error'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(messageService.add).toHaveBeenCalledWith(`ItemService: update item id=${mockItem.id} failed: Http failure response for https://node-listdetails.onrender.com/item: 500 Internal Server Error`);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/item`);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('addItem', () => {
    it('should add a new item and log a message', () => {
      const newItem = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' };
      const mockResponse = { id: 1, ...newItem };

      service.addItem(newItem as unknown as Item).subscribe(response => {
        expect(response).toEqual({ name: mockResponse.firstName, description: mockResponse.lastName });
        expect(messageService.add).toHaveBeenCalledWith(`ItemService: added item w/ id=${mockResponse.id}`);
      });
      const req = httpMock.expectOne(`${baseUrl}/item/add`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newItem);
      req.flush(mockResponse);
    });

    it('should handle errors when adding an item', () => {
      const newItem = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' };

      service.addItem(newItem as unknown as Item).subscribe({
        next: () => fail('Should have failed with server error'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(messageService.add).toHaveBeenCalledWith(`ItemService: add item failed: Http failure response for https://node-listdetails.onrender.com/item/add: 500 Internal Server Error`);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/item/add`);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('deleteItem', () => {
    it('should delete an item and log a message', () => {
      const mockItem: Item = { id: 1, name: 'John', description: 'Doe' };

      service.deleteItem(1).subscribe(response => {
        expect(response).toEqual(mockItem);
        expect(messageService.add).toHaveBeenCalledWith(`ItemService: deleted item id=${1}`);
      });

      const req = httpMock.expectOne(`${baseUrl}/item/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockItem);
    });

    it('should handle errors when deleting an item', () => {
      service.deleteItem(999).subscribe({
        next: () => fail('Should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(messageService.add).toHaveBeenCalledWith(`ItemService: delete item id=999 failed: Http failure response for https://node-listdetails.onrender.com/item/999: 404 Not Found`);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/item/999`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('searchItems', () => {
    it('should return matching items and log a message', fakeAsync(() => {
      const mockItems: Item[] = [
        { id: 1, name: 'John', description: 'Doe' },
      ];
      const searchTerm = 'John';

      // Call the method
      service.searchItems(searchTerm).subscribe(items => {
        expect(items).toEqual(mockItems);
        expect(messageService.add).toHaveBeenCalledWith(`ItemService: found items matching "${searchTerm}"`);
      });

      // Wait for debounce time
      tick(300);

      // Expect HTTP request
      const req = httpMock.expectOne(`${baseUrl}/items/?query=${searchTerm}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockItems);

    }));    it('should return empty array for empty search term', fakeAsync(() => {
      let result: Item[] = [];
      
      service.searchItems('').subscribe(items => {
        result = items;
      });

      tick(300);
      
      expect(result).toEqual([]);
      // No HTTP request should be made for empty search term
      httpMock.expectNone(`${baseUrl}/items/?query=`);
    }));

    it('should handle errors when searching items', fakeAsync(() => {
      const searchTerm = 'error';

      service.searchItems(searchTerm).subscribe({
        next: () => fail('Should have failed with server error'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(messageService.add).toHaveBeenCalledWith(`ItemService: search items "${searchTerm}" failed: Http failure response for https://node-listdetails.onrender.com/items/?query=${searchTerm}: 500 Internal Server Error`);
        }
      });

      tick(300);

      const req = httpMock.expectOne(`${baseUrl}/items/?query=${searchTerm}`);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    }));
  });
});