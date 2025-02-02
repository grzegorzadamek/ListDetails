import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { ItemService } from 'src/app/services/item.service';
import { signal, computed } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-item-add',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule
  ],
  templateUrl: './item-add.component.html',
  styleUrls: ['./item-add.component.css']
})
export class ItemAddComponent {
  name = signal('');
  description = signal('');

  isNameValid = computed(() => this.name().trim().length >= 2 && this.name().trim().length <= 50);
  isDescriptionValid = computed(() => this.description().trim().length >= 2 && this.description().trim().length <= 50);
  isFormValid = computed(() => this.isNameValid() || this.isDescriptionValid());

  constructor(
    private itemService: ItemService,
    private location: Location
  ) {}

  goBack(): void {
    this.location.back();
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      const item = {
        name: this.name(),
        description: this.description()
      };

      this.itemService.addItem(item)
        .subscribe(() => this.goBack());
    }
  }

  updateName(value: string): void {
    this.name.set(value);
  }

  updateDescription(value: string): void {
    this.description.set(value);
  }
}
