import { Component, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms"; // <-- NgModel lives here
import { Location, UpperCasePipe } from "@angular/common";
import { Hero } from "../hero";
import { ActivatedRoute } from "@angular/router";
import { HeroService } from "../hero.service";

@Component({
  selector: 'app-item-detail',
  standalone: true,
    imports: [
        FormsModule,
        UpperCasePipe
    ],
  templateUrl: './item-detail.component.html',
  styleUrl: './item-detail.component.css'
})
export class ItemDetailComponent implements OnInit {
  item: Hero | undefined;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getHero(id)
      .subscribe(item => this.item = item);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if(this.item){
      this.heroService.updateHero(this.item)
        .subscribe(() => this.goBack());
    }
  }
}
