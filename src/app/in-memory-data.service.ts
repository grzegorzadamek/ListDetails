import { Injectable } from '@angular/core';
import { InMemoryDbService } from "angular-in-memory-web-api";
import { Item } from "./item";

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const items = [
      { id: 12, firstName: 'Dr. Nice12', lastName: 'test1' },
      { id: 13, firstName: 'Bombasto21', lastName: 'test2' },
      { id: 14, firstName: 'Celeritas', lastName: 'test3' },
      { id: 15, firstName: 'Magneta', lastName: 'test4' },
      { id: 16, firstName: 'RubberMan', lastName: 'test5' },
      { id: 17, firstName: 'Dynama', lastName: 'test6' },
      { id: 18, firstName: 'Dr. IQ', lastName: 'test7' },
      { id: 19, firstName: 'Magma', lastName: 'test8' },
      { id: 20, firstName: 'Tornado', lastName: 'test9' }
    ];

    return { items };
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the heroes array is empty,
  // the method below returns the initial number (11).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.
  genId(items: Item[]): number {
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 11;
  }
}
