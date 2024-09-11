import { Component, OnInit } from '@angular/core';
import {
  NgFor
} from "@angular/common";
import { Item } from "../item";
import { ItemService } from "../item.service";
import { RouterLink } from "@angular/router";

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
export class ItemsComponent implements OnInit {
  items: Item[] = [];

  constructor(private itemService: ItemService) {}

  // To use this lifecycle hook method, you don't really have to do 'implements OnInit' on this class.
  // It works without that just fine.
  ngOnInit(){
    this.getItems();
  }

  getItems(): void {
    this.itemService.getItems().subscribe(items => {
      this.items = items;
    });
  }

  addItem(name: string): void {
    name = name.trim();
    if(!name) { return; }

    this.itemService.addItem({ name } as Item)
      .subscribe(item => {
        this.items.push(item);
      });
  }

  deleteItem(item: Item): void {
    // Immediately remove hero from the list, anticipating that the HeroService succeeds on the server
    this.items = this.items.filter(h => h !== item);
    this.itemService.deleteItem(item.id).subscribe();
  }
}
