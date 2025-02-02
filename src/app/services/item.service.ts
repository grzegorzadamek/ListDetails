import { Injectable } from '@angular/core';
import { Item } from "src/app/models/item";
import { catchError, Observable, of, tap, Subject, BehaviorSubject } from "rxjs";
import { MessageService } from "./message.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private itemsUrl = 'https://node-listdetails.onrender.com/api/items';
  private itemUrl = 'https://node-listdetails.onrender.com/api/item';
  private addItemUrl = 'https://node-listdetails.onrender.com/api/item/add';

//   private itemsUrl = 'http://localhost:3000/api/items';
//   private itemUrl = 'http://localhost:3000/api/item';
//   private addItemUrl = 'http://localhost:3000/api/item/add';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private userEmail: string = '';

  constructor(
    private messageService: MessageService,
    private httpClient: HttpClient
  ) { }

  setUser(data: string) {
    this.userEmail = data;
  }

  getItems(): Observable<Item[]> {
    const body = { owner: this.userEmail };

    return this.httpClient.post<Item[]>(this.itemsUrl, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'MyClientCert': '',
        'MyToken': ''
      })
    });
  }

  getItem(id: number): Observable<Item> {
    const url = `${this.itemUrl}/${id}`;
    const body = { owner: this.userEmail };

    return this.httpClient.post<Item>(url, body, this.httpOptions).pipe(
      tap(_ => this.log(`fetched item id=${id}`)),
      catchError(this.handleError<Item>(`getItem id=${id}`))
    );
  }


  updateItem(item: Item): Observable<any> {
    return this.httpClient.put(this.itemUrl, item, this.httpOptions).pipe(
      tap(_ => this.log(`updated item id=${item.id}`)),
      catchError(this.handleError<any>('updateItem'))
    );
  }

  addItem(item: { name: string, description: string }): Observable<{ name: string, description: string }> {
    const newItem = { name: item.name, description: item.description, owner: this.userEmail };
    return this.httpClient.post<Item>(this.addItemUrl, newItem, this.httpOptions).pipe(
      tap((newItem: Item) => this.log(`added item w/ id=${newItem.id}`)),
      catchError(this.handleError<Item>('addItem'))
    );
  }

  deleteItem(id: number): Observable<Item> {
    const url = `${this.itemUrl}/${id}`;
    return this.httpClient.delete<Item>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted item id=${id}`)),
      catchError(this.handleError<Item>('deleteItem'))
    );
  }

  searchItems(term: string): Observable<Item[]> {
    const body = { owner: this.userEmail };

    if (!term.trim()) {
      return of([]);
    }

    const url = `${this.itemsUrl}/?query=${term}`;

    return this.httpClient.post<Item[]>(url, body).pipe(
      tap(items => items.length ?
        this.log(`found items matching "${term}"`) :
        this.log(`no items matching "${term}"`)),
      catchError(this.handleError<Item[]>('searchItems', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.body.error}`);

      const emptyResult = result as T;
      return of(emptyResult);
    }
  }

  private log(message: string): void {
    this.messageService.add(`ItemService: ${message}`);
  }
}
