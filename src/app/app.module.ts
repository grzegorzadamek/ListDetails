
import { ItemService } from './item.service';
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppComponent
  ],
  providers: [ItemService]
})
export class AppModule {}