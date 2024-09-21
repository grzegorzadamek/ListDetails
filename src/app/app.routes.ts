import { Routes } from '@angular/router';
import { ItemsComponent } from "./items/items.component";
import { ItemDetailComponent } from "./item-detail/item-detail.component";
import { ItemAddComponent } from "./item-add/item-add.component";
import { DashboardComponent } from "./dashboard/dashboard.component";

export const routes: Routes = [
  { path: '', redirectTo:'/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'items', component: ItemsComponent },
  { path: 'add', component: ItemAddComponent },
  // parameterized route
  { path: 'detail/:id', component: ItemDetailComponent }
];
