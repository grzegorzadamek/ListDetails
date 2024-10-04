import { Component, signal, effect } from '@angular/core';
import { Item } from "../item";
import { ItemService } from "../item.service";
import { RouterLink } from "@angular/router";
import { ItemSearchComponent } from "../item-search/item-search.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    ItemSearchComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent {
  items = signal<Item[]>([]);

  constructor(private itemService: ItemService) {
    effect(() => this.getItems());
  }

  getItems(): void {
    this.itemService.getItems().subscribe(allItems => {
      this.items.set(allItems.slice(0, 4));
    });
  }
}