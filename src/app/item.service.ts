import { Injectable } from '@angular/core';
import { Item } from "./item";
import { catchError, Observable, of, tap } from "rxjs";
import { MessageService } from "./message.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  // :base/:collectionName
  // collectionName is the 'heroes' data object in the in-memory-data-service.ts
  private itemsUrl = 'api/items'; // URL to web api

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  // Angular injects singleton 'MessageService' into the 'private messageService' property when 'HeroService' is created
  constructor(private messageService: MessageService,
              private httpClient: HttpClient) {
  }

  getItems(): Observable<Item[]> {
    return this.httpClient.get<Item[]>(this.itemsUrl)
      .pipe(
        tap(_ => this.log('fetched items')),
        // catchError operator passes 'error' to the error handling function
        // 'handleError' function returns a function that will take the 'error' passed by catchError operator
        catchError(this.handleError<Item[]>('getItems', []))
      );
  }

  /** GET hero by id. Will 404 if id not found */
  getItem(id: number): Observable<Item> {
    const url = `${this.itemsUrl}/${id}`;
    return this.httpClient.get<Item>(url)
      .pipe(
        tap(_ => this.log(`fetched item id=${id}`)),
        catchError(this.handleError<Item>(`getItem id=${id}`))
      );
  }

  updateItem(item: Item): Observable<any> {
    return this.httpClient.put(this.itemsUrl, item, this.httpOptions)
      .pipe(
        tap(_ => this.log(`updated item id=${item.id}`)),
        catchError(this.handleError<any>('updateItem'))
      );
  }

  addItem(item: Item): Observable<Item> {
    return this.httpClient.post<Item>(this.itemsUrl, item, this.httpOptions)
      .pipe(
        tap((newItem: Item) => this.log(`added item w/ id=${newItem.id}`)),
        catchError(this.handleError<Item>('addItem'))
      );
  }

  deleteItem(id: number): Observable<Item> {
    const url = `${this.itemsUrl}/${id}`;
    return this.httpClient.delete<Item>(url, this.httpOptions)
      .pipe(
        tap(_ => this.log(`deleted item id=${id}`)),
        catchError(this.handleError<Item>('deleteItem'))
      );
  }

  searchItems(term: string): Observable<Item[]> {
    if(!term.trim()){
      // if not search term, return empty hero array.
      return of([]);
    }

    const url = `${this.itemsUrl}/?name=${term}`;

    return this.httpClient.get<Item[]>(url)
      .pipe(
        tap(items => items.length ?
          this.log(`found items matching "${term}"`) :
          this.log(`no items matching "${term}"`)),
        // handleError is executed when an error occurs in the API call, and it returns a new function
        // This new function is only called when catchError passes the error to it
        // So 1.handleError call happens and 2. the function returned by handleError call happens
        // Function returned by handleError provides the "replacement Observable"
        catchError(this.handleError<Item[]>('searchItems', []))
      );
  }

  // Learn more here: https://youtu.be/L9kFTps_7Tk?si=M6ZWbR71SD13DPk4&t=107
  // This method returns an 'error handler' function that expects 'error: any` input parameter
  private handleError<T>(operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      // 1TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // 1TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.body.error}`);

      const emptyResult = result as T;

      // Let the app keep running by returning an empty result.
      return of(emptyResult);
    }
  }

  private log(message: string): void {
    this.messageService.add(`ItemService: ${message}`);
  }
}
