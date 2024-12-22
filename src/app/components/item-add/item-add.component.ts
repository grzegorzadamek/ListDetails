import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Location, UpperCasePipe } from '@angular/common';
import { ItemService } from 'src/app/services/item.service';
import { signal, computed } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-item-add',
  standalone: true,
  imports: [
    FormsModule,
    UpperCasePipe,
    TranslateModule
  ],
  templateUrl: './item-add.component.html',
  styleUrls: ['./item-add.component.css']
})
export class ItemAddComponent {
  firstName = signal('');
  lastName = signal('');
  email = signal('');

  isFirstNameValid = computed(() => this.firstName().trim().length >= 2 && this.firstName().trim().length <= 50);
  isLastNameValid = computed(() => this.lastName().trim().length >= 2 && this.lastName().trim().length <= 50);
  isFormValid = computed(() => this.isFirstNameValid() || this.isLastNameValid());

  constructor(
    private itemService: ItemService,
    private location: Location
  ) {
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      const item = {
        firstName: this.firstName(),
        lastName: this.lastName(),
        email: this.email()
      };

      this.itemService.addItem(item)
        .subscribe(() => this.goBack());
    }
  }

  updateFirstName(value: string): void {
    this.firstName.set(value);
  }

  updateLastName(value: string): void {
    this.lastName.set(value);
  }

  updateEmail(value: string): void {
    this.email.set(value);
  }
}
