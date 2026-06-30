import { describe, expect, vi } from 'vitest';
import { ProductsController } from "./products.controller";
import { it } from "node:test"
import { ProductsService } from "../services/products.service";
import { AppDataSource } from '../../../services/datasource';
import { Product } from '../models/product.model';

describe('ProductsController', () => {

    //let repository = AppDataSource.getRepository(Product);
    //let service = new ProductsService(repository);
    //let controller = new ProductsController(service);
    const products = [] as Product []
    let mockService = {
        listProducts: () => {
            return products;
        },
    } as unknown as ProductsService;

    let controller = new ProductsController(mockService);

    it('deve retornar a lista de produtos', () => {
       const result = controller.list();
    })
})