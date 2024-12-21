import { Routes } from '@angular/router';
import { ItemsComponent } from "./components/items/items.component";
import { ItemDetailComponent } from "./components/item-detail/item-detail.component";
import { ItemAddComponent } from "./components/item-add/item-add.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'items', component: ItemsComponent },
  { path: 'add', component: ItemAddComponent },
  { path: 'detail/:id', component: ItemDetailComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  // This route needs to be last - it will catch all unknown paths
  { path: '**', redirectTo: '/dashboard' }
];
