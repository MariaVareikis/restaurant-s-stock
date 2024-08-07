import { Body, Controller, Get, NotFoundException, Param, Post } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { Product } from "./product.model";

// Decorator to define this class as a NestJS controller handling 'products' routes
@Controller('products')
export class ProductsController {

    // Inject the ProductsService into the controller
    constructor(private readonly productsService: ProductsService) { }

    // Endpoint to add a new product
    // Method: POST
    // Route: /products
    @Post()
    addProduct(@Body() product: Product) {
        // Calls the service to insert a new product
        return this.productsService.insertProduct(product);
    }

    // Endpoint to get all products
    // Method: GET
    // Route: /products
    @Get()
    getAllProducts() {
        // Calls the service to retrieve all products
        return this.productsService.getProducts();
    }

    // Endpoint to update an existing product
    // Method: POST
    // Route: /products/:id
    @Post(':id')
    updateProduct(@Param('id') id: string, @Body() updatedProduct: Partial<Product>) {
        // Calls the service to update a product by ID with the provided data
        return this.productsService.updateProduct(id, updatedProduct);
    }

    // Endpoint to delete a product
    // Method: POST
    // Route: /products/delete/:id
    // Mark the product as deleted in the service
    @Post('delete/:id')
    deleteProduct(@Param('id') id: string) {
        const result = this.productsService.deleteProduct(id);
        if (result) {
            // If product is successfully marked as deleted
            return { message: 'Product marked as deleted successfully' };
        } else {
            // If the product with the given ID was not found
            throw new NotFoundException('Product not found');
        }
    }

    // Endpoint to restore a previously deleted product
    // Method: POST
    // Route: /products/restore/:id
    // Restore the product with the given ID
    @Post('restore/:id')
    restoreProduct(@Param('id') id: string) {
        const result = this.productsService.restoreProduct(id);
        if (result) {
            // If product is successfully restored
            return { message: 'Product restored successfully' };
        } else {
            // If the product with the given ID was not found
            throw new NotFoundException('Product not found');
        }
    }
}
