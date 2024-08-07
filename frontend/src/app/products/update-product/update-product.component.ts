import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-update-product',
  standalone: true,
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class UpdateProductComponent implements OnInit {
  // Input property to receive the product data from the parent component
  @Input() product!: Partial<Product>;

  // Output event emitter to notify the parent component about the updated product
  @Output() productUpdated = new EventEmitter<Product>();

  // Output event emitter to notify the parent component to close the modal
  @Output() closeModal = new EventEmitter<void>();

  // Reactive form for updating product details
  updateForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    // Initialize the form with product data and validation rules
    this.updateForm = this.fb.group({
      name: [this.product.name, [Validators.required]], // Name field with required validation
      quantity: [this.product.quantity, [Validators.required, Validators.min(1)]], // Quantity field with required and minimum value validation
      serialNumber: [this.product.serialNumber, [Validators.required]], // Serial Number field with required validation
      createdAt: [{ value: this.product.createdAt, disabled: true }], // Created At field, disabled for editing
      updatedAt: [{ value: this.product.updatedAt, disabled: true }], // Updated At field, disabled for editing
      isDeleted: [this.product.isDeleted] // Is Deleted checkbox
    });
  }

  // Handle form submission and emit updated product data
  onSubmit(): void {
    if (this.updateForm.valid) {
      const updatedProduct: Product = { ...this.product, ...this.updateForm.value, updatedAt: new Date() };
      this.productUpdated.emit(updatedProduct); // Emit the updated product data
    }
  }

  // Handle closing the modal and emit the close event
  onCloseModal(): void {
    this.closeModal.emit(); // Emit the close modal event
  }
}
