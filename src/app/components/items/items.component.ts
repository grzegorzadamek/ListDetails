import { Component, signal, computed, effect } from '@angular/core';
import { NgFor } from "@angular/common";
import { Item } from "src/app/models/item";
import { ItemService } from "src/app/services/item.service";
import { Router, RouterLink } from "@angular/router";
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [
    NgFor,
    RouterLink,
    TranslateModule
  ],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css'
})
export class ItemsComponent {
  items = signal<Item[]>([]);
  selectedItem = signal<Item | null>(null);
  public isLoading = signal(true);

  constructor(
    private itemService: ItemService,
    private router: Router
    ) {
    effect(() => {
        this.getItems()
    });
  }

  getItems(): void {
    this.itemService.getItems()
      .subscribe(items => {
        this.isLoading.set(false);
        this.items.set(items);
      });
  }

  onSelect(item: Item): void {
    this.selectedItem.set(item);
  }

  totalItems = computed(() => this.items().length);

  addItem(): void {
    this.router.navigateByUrl('/add');
  }

  deleteItem(item: Item): void {
    this.items.update(items => items.filter(h => h !== item));
    this.itemService.deleteItem(item.id).subscribe();
  }
}
