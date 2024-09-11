import { Component, OnInit } from '@angular/core';
import {
  NgFor
} from "@angular/common";
import { Hero } from "../hero";
import { HeroService } from "../hero.service";
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
  items: Hero[] = [];

  constructor(private heroService: HeroService) {}

  // To use this lifecycle hook method, you don't really have to do 'implements OnInit' on this class.
  // It works without that just fine.
  ngOnInit(){
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe(items => {
      this.items = items;
    });
  }

  addItem(name: string): void {
    name = name.trim();
    if(!name) { return; }

    this.heroService.addHero({ name } as Hero)
      .subscribe(item => {
        this.items.push(item);
      });
  }

  deleteItem(item: Hero): void {
    // Immediately remove hero from the list, anticipating that the HeroService succeeds on the server
    this.items = this.items.filter(h => h !== item);
    this.heroService.deleteHero(item.id).subscribe();
  }
}
