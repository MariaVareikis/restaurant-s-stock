import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { Product } from '../../models/product.model';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-add-product',
  standalone: true,
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class AddProductComponent implements OnInit {
  // Output event emitter to notify parent component when a product is added
  @Output() productAdded = new EventEmitter<Product>();

  // Output event emitter to notify parent component to close the modal
  @Output() closeModal = new EventEmitter<void>();

  // Form group for managing the form controls and validation
  addForm!: FormGroup;

  // Inject FormBuilder service to create and manage the form
  constructor(private fb: FormBuilder) { }

  // Initialize the form with default values and validation rules
  ngOnInit(): void {
    this.addForm = this.fb.group({
      name: ['', [Validators.required]], // Form control for product name
      quantity: [1, [Validators.required, Validators.min(1)]], // Form control for product quantity
      serialNumber: ['', [Validators.required]], // Form control for product serial number
      createdAt: [{ value: new Date(), disabled: true }], // Form control for created date (read-only)
      updatedAt: [{ value: new Date(), disabled: true }], // Form control for updated date (read-only)
      isDeleted: [false] // Form control for product deletion status
    });
  }

  // Method to handle form submission
  onSubmit(): void {
    // Check if the form is valid before emitting the product data
    if (this.addForm.valid) {
      // Create a new product object with a unique ID and current date
      const newProduct: Product = {
        ...this.addForm.value,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      // Emit the new product data to the parent component
      this.productAdded.emit(newProduct);
    }
  }

  // Method to handle closing the modal
  onCloseModal(): void {
    // Emit an event to notify the parent component to close the modal
    this.closeModal.emit();
  }
}
