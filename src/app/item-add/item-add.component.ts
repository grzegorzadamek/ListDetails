import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms"; // <-- NgModel lives here
import { Location, UpperCasePipe } from "@angular/common";
import { ItemService } from "../item.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-item-add',
  standalone: true,
    imports: [
        FormsModule,
        UpperCasePipe,
        ReactiveFormsModule
    ],
  templateUrl: './item-add.component.html',
  styleUrl: './item-add.component.css'
})
export class ItemAddComponent implements OnInit {
  userForm!: FormGroup;

  constructor(
    private itemService: ItemService,
    private location: Location,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });
  }


  goBack(): void {
    this.location.back();
  }

  onSubmit(): void {
    let item: {firstName: string, lastName: string} = {firstName: '', lastName: ''};
    item.firstName = this.userForm.get('firstName')?.value ?? '';
    item.lastName = this.userForm.get('lastName')?.value ?? '';

    this.itemService.addItem(item)
      .subscribe(() => this.goBack());
  }
}
