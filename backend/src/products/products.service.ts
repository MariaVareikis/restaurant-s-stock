import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Product } from './product.model';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProductsService {
  // Array to hold the products
  private products: Product[] = [];

  // Path to the JSON file where products are stored
  private readonly filePath: string;

  constructor() {
    // Initialize the file path and load products from the file
    this.filePath = path.resolve(process.cwd(), 'src', 'assets', 'products.json');
    this.loadProducts();
  }

  // Load products from the JSON file
  private loadProducts() {
    if (fs.existsSync(this.filePath)) {
      const fileContent = fs.readFileSync(this.filePath, 'utf-8');
      const productsJson = JSON.parse(fileContent);
      
      // Convert dates to proper Date objects
      this.products = productsJson.map((product: Product) => ({
        ...product,
        createdAt: new Date(product.createdAt),
        updatedAt: new Date(product.updatedAt),
      }));
    }
  }

  // Save products to the JSON file
  private saveProducts() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2));
  }

  // Validate a product instance using class-validator
  private async validateProduct(product: Product) {
    const productInstance = plainToInstance(Product, product);
    try {
      await validateOrReject(productInstance);
    } catch (errors) {
      // Combine validation errors into a single string
      const errorMessages = errors.map((error: any) => Object.values(error.constraints)).join(', ');
      throw new BadRequestException(`Validation failed: ${errorMessages}`);
    }
  }

  // Insert a new product
  async insertProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const newProduct: Product = {
      id: uuidv4(),
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.validateProduct(newProduct); // Validate before saving

    this.products.push(newProduct);
    this.saveProducts();
    return newProduct;
  }

  // Retrieve all products, optionally including deleted ones
  getProducts(includeDeleted = false): Product[] {
    if (includeDeleted) {
      return [...this.products];
    }
    return this.products.filter(product => !product.isDeleted);
  }

  // Update an existing product by ID
  async updateProduct(id: string, updatedProduct: Partial<Product>): Promise<Product> {
    const [product, index] = this.findProduct(id);
    const updatedProductData: Product = { ...product, ...updatedProduct, id, updatedAt: new Date() };

    await this.validateProduct(updatedProductData); // Validate before updating

    this.products[index] = updatedProductData;
    this.saveProducts();
    return updatedProductData;
  }

  // Soft-delete a product by ID
  deleteProduct(id: string): string {
    const [product, index] = this.findProduct(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    this.products[index] = { ...product, isDeleted: true, updatedAt: new Date() };
    this.saveProducts();
    return 'Product marked as deleted successfully';
  }

  // Restore a soft-deleted product by ID
  restoreProduct(id: string): string {
    const [product, index] = this.findProduct(id);
    if (!product.isDeleted) {
      throw new NotFoundException('Product is not deleted');
    }
    this.products[index] = { ...product, isDeleted: false, updatedAt: new Date() };
    this.saveProducts();
    return 'Product restored successfully';
  }

  // Find a product by ID and return it along with its index
  private findProduct(id: string): [Product, number] {
    const productIndex = this.products.findIndex(p => p.id === id);
    const product = this.products[productIndex];
    if (!product) {
      throw new NotFoundException('Could not find product.');
    }
    return [product, productIndex];
  }
}
