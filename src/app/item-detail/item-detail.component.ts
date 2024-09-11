import { Component, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms"; // <-- NgModel lives here
import { Location, UpperCasePipe } from "@angular/common";
import { Item } from "../item";
import { ActivatedRoute } from "@angular/router";
import { ItemService } from "../item.service";

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
  item: Item | undefined;

  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getItem();
  }

  getItem(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.itemService.getItem(id)
      .subscribe(item => this.item = item);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if(this.item){
      this.itemService.updateItem(this.item)
        .subscribe(() => this.goBack());
    }
  }
}
