import { Component, OnInit } from '@angular/core';
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
export class ItemsComponent implements OnInit {
  items: Item[] = [];

  constructor(private itemService: ItemService, private router: Router) {}

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

  addItem(): void {
    this.router.navigateByUrl('/add');
  }

  deleteItem(item: Item): void {
    // Immediately remove hero from the list, anticipating that the HeroService succeeds on the server
    this.items = this.items.filter(h => h !== item);
    this.itemService.deleteItem(item.id).subscribe();
  }
}
