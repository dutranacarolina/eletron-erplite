import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { ProductsController } from './products.controller';
import { ProductsService } from '../services/products.service';

describe('ProductsController', () => {
  let controller: ProductsController;

  const mockService = {
    listProducts:vi.fn(),
    findProductById: vi.fn(),
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
  } 

  beforeAll(() => {
    controller = new ProductsController(mockService as unknown as ProductsService);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar a lista de produtos', async () => {
    const fakeProducts = [{ id: '1', name: 'Teste'}];
    
    mockService.listProducts.mockResolvedValue(fakeProducts);

    const result = await controller.index();

    expect(mockService.listProducts).toHaveBeenCalledTimes(1);
    expect(result).toEqual(fakeProducts);
  });

  it('deve retornar um produto pelo ID', async  () => {
    const fakeProduct = {
      id: '1',
      name: 'Teste',
    };

    mockService.findProductById.mockResolvedValue(fakeProduct);

    const result = await controller.find('1');

    expect(mockService.findProductById).toHaveBeenCalledWith('1');
    expect(result).toEqual(fakeProduct);
  });

  it('deve criar um produto', async () => {
    const data = {
      name: 'Notebook',
      price: 3000,
    }; 
    
    mockService.createProduct.mockResolvedValue(data);

    const result = await controller.create(data);

    expect(mockService.createProduct).toHaveBeenCalledWith(data);
    expect(result).toEqual(data);
  }); 
  
it('deve lançar erro quando o nome não for informado', async () => {
  await expect(
    controller.create({
      name: '',
      sku: '123',
      quantity: 10,
      price: 3000,
      sellPrice: 3500,
    })
  ).rejects.toThrow('Nome obrigatório');
});

it('deve lançar erro quando o preço for invalido', async () => {
  await expect(
    controller.create({
      name: 'Notebook',
      sku: '123',
      quantity: 10,
      price: 0,
      sellPrice: 3500,
    })
  ).rejects.toThrow('Preço inválido');
});

});
