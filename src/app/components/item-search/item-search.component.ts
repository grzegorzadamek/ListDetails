import { Component, inject, signal, computed, effect } from '@angular/core';
import { debounceTime, distinctUntilChanged, Observable, Subject, switchMap } from 'rxjs';
import { Item } from 'src/app/models/item';
import { RouterLink } from '@angular/router';
import { ItemService } from 'src/app/services/item.service';
import { TranslateModule } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-item-search',
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule
  ],
  templateUrl: './item-search.component.html',
  styleUrl: './item-search.component.css'
})
export class ItemSearchComponent {
  private itemService = inject(ItemService);
  private searchTerms = new Subject<string>();
  
  // Create an observable from the search terms subject with debounce and filtering
  private items$ = this.searchTerms.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((term) => this.itemService.searchItems(term))
  );
  
  // Convert the observable to a signal
  items = toSignal(this.items$, { initialValue: [] as Item[] });

  constructor() {
    // Initialize the search with an empty string to show initial results
    this.search('');
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }
}