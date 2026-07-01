import { Repository, Like } from 'typeorm';
import { Product } from '../models/product.model';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { CreateProductDto } from '../dtos/create-product.dto';

export class ProductsService {
  constructor(private productRepository: Repository<Product>) {}

  async listProducts(filters?: {
    name?: string;
    sku?: string;
    quantity?: number;
    price?: number;
  }) {
    const where: any = {};

    if (filters?.name) {
      where.name = Like (`%${filters.name}%`);
    }

     if (filters?.sku) {
      where.sku = Like (`%${filters.sku}%`);
    }

     if (filters?.quantity !== undefined) {
      where.quantity = filters.quantity;
    }

     if (filters?.price !== undefined) {
      where.price = filters.price;
    }
    return await this.productRepository.find({ where });
  }

  async findProductById(id: string) {
     const product = await this.productRepository.findOne({
      where: { id },
     });
     if (!product) {
      throw new Error('Produto não encontrado');
     }
     return product;
  }

  async createProduct(data: CreateProductDto) {
    const productExists = await this.productRepository.findOne({
      where: {
        sku: data.sku,
      },
    }); 

    if (productExists) {
      throw new Error('SKU já cadastrado');
    }

    if (data.price! > data.sellPrice!){
      throw new Error('O preço não pode ser maior que o preço de venda');
    }

    if (data.quantity! < 0){
      throw new Error('Quantidade não pode ser menor que zero');
    }

    const product = this.productRepository.create(data);
    return await this.productRepository.save(product);
  }

  async updateProduct( id: string, data: UpdateProductDto){
    const product = await this.findProductById(id);

    if (data.sku && data.sku !== product.sku){
      const skuExists = await this.productRepository.findOne({
        where: { sku: data.sku },
      });

      if (skuExists){
        throw new Error('SKU já cadastrada');
      }
    }

    if (
      data.price !== undefined &&
      data.sellPrice !== undefined &&
      data.price > data.sellPrice
    ){
      throw new Error('O preço não pode ser maior que o preço de venda');
    }

    if (data.quantity !== undefined && data.quantity < 0 ){
      throw new Error('Quantidade não pode ser menor que zero');
    }

    await this.productRepository.update(id,data);
    return await this.findProductById(id);

  } 

  async deleteProduct(id: string){
    await this.findProductById(id);
    await this.productRepository.delete(id);
    return { success: true};
  }
  
   }
  

