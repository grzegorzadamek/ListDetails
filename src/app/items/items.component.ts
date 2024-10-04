import { Component, signal, computed } from '@angular/core';
import {
  NgFor
} from "@angular/common";
import { Item } from "../item";
import { ItemService } from "../item.service";
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [
    NgFor,
    RouterLink
  ],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css'
})
export class ItemsComponent {
  items = signal<Item[]>([]);
  selectedItem = signal<Item | null>(null);


  constructor(private itemService: ItemService, private router: Router) {
    this.getItems();
  }

  getItems(): void {
    this.itemService.getItems()
      .subscribe(items => this.items.set(items));
  }

  onSelect(item: Item): void {
    this.selectedItem.set(item);
  }

  totalItems = computed(() => this.items().length);

  addItem(): void {
    this.router.navigateByUrl('/add');
  }

  deleteItem(item: Item): void {
    // Immediately remove hero from the list, anticipating that the HeroService succeeds on the server
    this.items.update(items => items.filter(h => h !== item));
    this.itemService.deleteItem(item.id).subscribe();
  }
}
