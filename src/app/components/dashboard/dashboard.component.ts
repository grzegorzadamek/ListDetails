import { Component, signal, effect, inject } from '@angular/core';
import { Item } from "src/app/models/item";
import { ItemService } from "src/app/services/item.service";
import { RouterLink } from "@angular/router";
import { ItemSearchComponent } from "src/app/components/item-search/item-search.component";
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private itemService = inject(ItemService);
  
  items = signal<Item[]>([]);
  isLoading = signal(true);

  constructor() {
    // Load items when component initializes
    this.getItems();
  }

  getItems(): void {
    this.itemService.getItems()
      .pipe(takeUntilDestroyed())
      .subscribe(allItems => {
        this.isLoading.set(false);
        this.items.set(allItems.slice(0, 4));
      });
  }
}