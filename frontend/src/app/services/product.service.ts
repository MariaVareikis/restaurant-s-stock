import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // BehaviorSubject to hold the current list of products and emit updates to subscribers
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable(); // Observable for components to subscribe to

  constructor(private http: HttpClient) {
    this.loadProducts(); // Load products on initialization
  }

  // Load products from the backend and update the BehaviorSubject
  public loadProducts(): void {
    this.http.get<Product[]>(environment.productsUrl).pipe(
      catchError(error => {
        console.error('Error loading products:', error); // Log error
        return throwError(() => new Error(error)); // Return an observable error
      })
    ).subscribe({
      next: (data) => this.productsSubject.next(data), // Update the BehaviorSubject with new products
      error: (error) => console.error('Error loading products:', error) // Log error
    });
  }

  // Add a new product to the backend and update the BehaviorSubject
  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(environment.productsUrl, product).pipe(
      tap((newProduct) => {
        const products = this.productsSubject.getValue(); // Get current list of products
        this.productsSubject.next([...products, newProduct]); // Add new product to list and update BehaviorSubject
      }),
      catchError(error => {
        console.error('Error adding product:', error); // Log error
        return throwError(() => new Error(error)); // Return an observable error
      })
    );
  }

  // Delete a product from the backend and update the BehaviorSubject
  deleteProduct(id: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${environment.productsUrl}/delete/${id}`, {}).pipe(
      tap(() => {
        const products = this.productsSubject.getValue().filter(product => product.id !== id); // Filter out deleted product
        this.productsSubject.next(products); // Update the BehaviorSubject with filtered products
      }),
      catchError(error => {
        console.error('Error deleting product:', error); // Log error
        return throwError(() => new Error(error)); // Return an observable error
      })
    );
  }

  // Restore a deleted product and refresh the product list
  restoreProduct(id: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${environment.productsUrl}/restore/${id}`, {}).pipe(
      tap(() => this.loadProducts()), // Reload the products list
      catchError(error => {
        console.error('Error restoring product:', error); // Log error
        return throwError(() => new Error(error)); // Return an observable error
      })
    );
  }

  // Update an existing product and refresh the BehaviorSubject
  updateProduct(id: string, updatedProduct: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${environment.productsUrl}/${id}`, updatedProduct).pipe(
      tap((updatedProduct) => {
        const products = this.productsSubject.getValue(); // Get current list of products
        const index = products.findIndex(product => product.id === id); // Find the index of the product to update
        if (index !== -1) {
          products[index] = { ...products[index], ...updatedProduct }; // Update the product in the list
          this.productsSubject.next(products); // Update the BehaviorSubject with the updated list
        }
      }),
      catchError(error => {
        console.error('Error updating product:', error); // Log error
        return throwError(() => new Error(error)); // Return an observable error
      })
    );
  }
}
