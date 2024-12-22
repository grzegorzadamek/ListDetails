import { Component, signal, effect } from '@angular/core';
import { Item } from "src/app/models/item";
import { ItemService } from "src/app/services/item.service";
import { RouterLink } from "@angular/router";
import { ItemSearchComponent } from "src/app/components/item-search/item-search.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    ItemSearchComponent,
    TranslateModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent {

  items = signal<Item[]>([]);
  public isLoading = signal(true);

  constructor(private itemService: ItemService
  ) {
    effect(() => {
      this.getItems()});
  }

  getItems(): void {
    this.itemService.getItems().subscribe(allItems => {
      this.isLoading.set(false);
      this.items.set(allItems.slice(0, 4));
    });
  }
}
