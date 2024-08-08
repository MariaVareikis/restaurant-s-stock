import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { UpdateProductComponent } from '../update-product/update-product.component';
import { AddProductComponent } from '../add-product/add-product.component';
import { SearchProductComponent } from '../search-product/search-product.component';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products-list',
  standalone: true,
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
  imports: [
    CommonModule,
    HttpClientModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    UpdateProductComponent,
    AddProductComponent,
    SearchProductComponent
  ],
  providers: [DatePipe, ProductService]
})
export class ProductsListComponent {
  // Observable for the list of products
  products$: Observable<Product[]>;

  // Observable for the filtered list of products based on search criteria
  filteredProducts$: Observable<Product[]>;

  // Flag to control the visibility of the undo button
  undoFlag = false;

  // Store the recently deleted product for potential restoration
  recentlyDeletedProduct: Product | null = null;

  // Product that is currently being considered for deletion
  productToDelete: Product | null = null;

  // ID of the product for undoing deletion
  undoId = '';

  // Injectable DatePipe for formatting dates
  private datePipe = inject(DatePipe);

  // Flag to control the visibility of the update product modal
  showModal = false;

  // The product currently selected for updating
  selectedProduct!: Partial<Product>;

  // Flag to control the visibility of the add product modal
  showAddProductModalFlag = false;

  // Flag to indicate whether any modal or delete action is open
  isActionOpen = false;

  constructor(private productService: ProductService) {
    // Initialize observables for products and filtered products
    this.products$ = this.productService.products$;
    this.filteredProducts$ = this.products$;
  }

  // Format a date using DatePipe
  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'short') || '';
  }

  // Trigger confirmation dialog for product deletion using SweetAlert2
  confirmDelete(product: Product): void {
    this.productToDelete = product;
    this.isActionOpen = true; // Disable other buttons

    // Show SweetAlert2 confirmation dialog
    Swal.fire({
      title: 'Delete Product',
      text: `Are you sure you want to delete ${product.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteProduct();
      } else {
        this.isActionOpen = false; // Enable other buttons if cancelled
      }
    });
  }

  // Perform product deletion and handle related updates
  deleteProduct(): void {
    if (!this.productToDelete) {
      return;
    }

    this.productService.deleteProduct(this.productToDelete.id).subscribe({
      next: () => {
        this.products$.subscribe(products => {
          if (!products) {
            return;
          }
          this.recentlyDeletedProduct = products.find(product => product.id === this.productToDelete?.id) || null;
        });
        Swal.fire({
          title: "Deleted!",
          text: "Your product has been deleted.",
          icon: "success"
        });
        this.undoFlag = true;
        this.undoId = this.productToDelete.id;
        this.productToDelete = null; // Reset productToDelete after deletion
        this.isActionOpen = false; // Enable other buttons
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        Swal.fire({
          title: "Error!",
          text: "There was an issue deleting the product.",
          icon: "error"
        });
        this.isActionOpen = false; // Enable other buttons
      }
    });
  }

  // Undo the most recent product deletion
  undoDelete(): void {
    if (!this.undoId) {
      return;
    }

    this.productService.restoreProduct(this.undoId).subscribe({
      next: () => {
        this.undoFlag = false;
        this.undoId = '';
      },
      error: (error) => console.error('Error restoring product:', error)
    });
  }

  // Open the update product modal and set the selected product
  openModal(product: Partial<Product>): void {
    this.selectedProduct = product;
    this.showModal = true;
    this.isActionOpen = true; // Disable other buttons
  }

  // Close the update product modal
  closeModal(): void {
    this.showModal = false;
    this.isActionOpen = false; // Enable other buttons
  }

  // Handle product update and refresh the product list
  onProductUpdated(updatedProduct: Product): void {
    this.productService.updateProduct(updatedProduct.id, updatedProduct).subscribe({
      next: () => {
        this.closeModal();
        this.productService.loadProducts(); // Refresh the products list
      },
      error: (error) => console.error('Error updating product:', error)
    });
  }

  // Show the add product modal
  showAddProductModal(): void {
    this.showAddProductModalFlag = true;
    this.isActionOpen = true; // Disable other buttons
  }

  // Close the add product modal
  closeAddProductModal(): void {
    this.showAddProductModalFlag = false;
    this.isActionOpen = false; // Enable other buttons
  }

  // Handle adding a new product and refresh the product list
  onProductAdded(newProduct: Product): void {
    this.productService.addProduct(newProduct).subscribe({
      next: () => {
        this.closeAddProductModal();
        this.productService.loadProducts(); // Refresh the products list
      },
      error: (error) => console.error('Error adding product:', error)
    });
  }

  // Filter products based on the search term for name and serial number
  onSearch(searchTerm: string): void {
    this.filteredProducts$ = this.products$.pipe(
      map(products =>
        products.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }
}
