import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms"; // <-- NgModel lives here
import { Location, UpperCasePipe } from "@angular/common";
import { Item } from "../item";
import { ActivatedRoute } from "@angular/router";
import { ItemService } from "../item.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-item-detail',
  standalone: true,
    imports: [
        FormsModule,
        UpperCasePipe,
        ReactiveFormsModule
    ],
  templateUrl: './item-detail.component.html',
  styleUrl: './item-detail.component.css'
})
export class ItemDetailComponent implements OnInit {
  public userForm!: FormGroup;
  public loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService,
    private location: Location,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
    });
    this.getItem();
  }

  getItem(): void {
    this.loading = true;
    this.userForm.disable();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.itemService.getItem(id)
          .subscribe(item => {
            if (item) {
              this.loading = false;
              this.userForm.enable();
              this.userForm.patchValue({
                firstName: item.firstName,
                lastName: item.lastName,
                email: item.email,
                id: item.id
              });
            }
          });
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit(): void {
    let item: Item = {id: 0, firstName: '', lastName: '', email: ''};
    item.id = this.userForm.get('id')?.value ?? 0;
    item.firstName = this.userForm.get('firstName')?.value ?? '';
    item.lastName = this.userForm.get('lastName')?.value ?? '';
    item.email = this.userForm.get('email')?.value ?? '';

    if(item){
      this.itemService.updateItem(item)
        .subscribe(() => this.goBack());
    }
  }
}
