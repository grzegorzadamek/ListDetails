import { Component, signal, effect, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { Item } from 'src/app/models/item';
import { ActivatedRoute } from '@angular/router';
import { ItemService } from 'src/app/services/item.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './item-detail.component.html',
  styleUrl: './item-detail.component.css'
})
export class ItemDetailComponent {
  private route = inject(ActivatedRoute);
  private itemService = inject(ItemService);
  private location = inject(Location);
  private fb = inject(FormBuilder);

  userForm: FormGroup;
  isLoading = signal(true);

  constructor() {
    this.userForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
    
    // Create the effect exactly as in the original code
    effect(() => this.getItem());
  }

  getItem(): void {
    this.userForm.disable();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    this.itemService.getItem(id).subscribe({
      next: (item) => {
        if (item) {
          this.isLoading.set(false);
          this.userForm.enable();
          this.userForm.patchValue({
            name: item.name,
            description: item.description,
            id: item.id
          });
        }
      },
      error: (err) => {
        console.error('Error fetching item:', err);
        this.isLoading.set(false);
        this.userForm.enable();
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const item: Item = {
        id: this.userForm.get('id')?.value ?? 0,
        name: this.userForm.get('name')?.value ?? '',
        description: this.userForm.get('description')?.value ?? '',
      };
      
      this.itemService.updateItem(item).subscribe({
        next: () => this.goBack(),
        error: (err) => console.error('Error updating item:', err)
      });
    }
  }
}