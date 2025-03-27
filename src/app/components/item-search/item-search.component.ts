import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Observable, Subject, switchMap } from 'rxjs';
import { Item } from 'src/app/models/item';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { ItemService } from 'src/app/services/item.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-item-search',
    imports: [
        RouterLink,
        AsyncPipe,
        TranslateModule
    ],
    templateUrl: './item-search.component.html',
    styleUrl: './item-search.component.css'
})
export class ItemSearchComponent implements OnInit {
  items$!: Observable<Item[]>;
  private searchTerms = new Subject<string>();

  constructor(
    private itemService: ItemService
  ) {}

  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.items$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) => this.itemService.searchItems(term))
    );
  }
}
