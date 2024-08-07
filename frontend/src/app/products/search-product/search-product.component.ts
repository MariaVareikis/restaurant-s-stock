import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-search-product',
  standalone: true,
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.css'],
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatIconModule]
})
export class SearchProductComponent {
  // The current search term entered by the user
  searchTerm: string = '';

  // Event emitter to notify parent component of the search term
  @Output() search = new EventEmitter<string>();

  // Method called when the input value changes
  onSearchChange(event: Event): void {
    // Cast the event target to an HTMLInputElement to access its value
    const input = event.target as HTMLInputElement;
    // Update the searchTerm with the new value
    this.searchTerm = input.value;
    // Emit the updated searchTerm to the parent component
    this.search.emit(this.searchTerm);
  }
}
