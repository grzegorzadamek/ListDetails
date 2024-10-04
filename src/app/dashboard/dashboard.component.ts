import { Component, OnInit } from '@angular/core';
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
export class DashboardComponent implements OnInit{
  items: Item[] = [];

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.getItems();
  }

  getItems(): void {
    this.itemService.getItems().subscribe(items => {
      this.items = items.slice(0, 4);
    });
  }
}
