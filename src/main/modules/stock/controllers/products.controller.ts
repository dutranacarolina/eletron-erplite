import { error } from 'node:console';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';

export class ProductsController {
  constructor(private productsService: ProductsService) {}

  index(filters?: {
    name?: string;
    sku?: string;
    quantity?: number;
    price?: number;
  }) {
    return this.productsService.listProducts(filters);
  }

  list(filters?: {
    name?: string;
    sku?: string;
    quantity?: number;
    price?: number;
  }){
    return this.productsService.listProducts(filters);
  }

  async find(id: string ){
    if (!id){
      throw new Error('ID inválido');
    }
    return this.productsService.findProductById(id);
  }

  async create(data:CreateProductDto) {
    if (!data.name) {
      throw new Error('Nome obrigatório');
    }
    if (data.price <= 0) {
      throw new Error('Preço inválido');
    }
    return this.productsService.createProduct(data);
    }

    update(
      id: string,
      data:UpdateProductDto
    ) {
      if (!id){
        throw new Error('ID inválido')
      }
      return this.productsService.updateProduct(id,data);
    }

    delete(id: string) {
      if (!id){
        throw new Error('ID inválido')
      }
      return this.productsService.deleteProduct(id);
    }
}
