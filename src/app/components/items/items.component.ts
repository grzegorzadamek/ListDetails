import { Component, signal, computed, inject, effect, DestroyRef } from '@angular/core';
import { Item } from "src/app/models/item";
import { ItemService } from "src/app/services/item.service";
import { Router, RouterLink } from "@angular/router";
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css'
})
export class ItemsComponent {
  private itemService = inject(ItemService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  
  items = signal<Item[]>([]);
  selectedItem = signal<Item | null>(null);
  isLoading = signal(true);
  totalItems = computed(() => this.items().length);

  constructor() {
    // Load items when component initializes
    this.getItems();
  }

  getItems(): void {
    this.itemService.getItems()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(items => {
        this.isLoading.set(false);
        this.items.set(items);
      });
  }

  onSelect(item: Item): void {
    this.selectedItem.set(item);
  }

  addItem(): void {
    this.router.navigateByUrl('/add');
  }

  deleteItem(item: Item): void {
    // Optimistically update UI first
    this.items.update(items => items.filter(h => h !== item));

    // Then perform the actual delete operation
    this.itemService.deleteItem(item.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (err) => {
          console.error('Error deleting item:', err);
          // If there's an error, revert the optimistic update by refetching items
          this.getItems();
        }
      });
  }
}