import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { Equal, Repository } from 'typeorm';
import { ProductsService } from './products.service';
import { Product } from '../models/product.model';

describe('ProductsService', () => {
  let service: ProductsService;

  const mockRepository = {
    find: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  } as unknown as any;

  beforeAll(() => {
    service = new ProductsService(mockRepository);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

it('deve retornar a lista de produtos', async () => {
  const fakeProducts = [
    { id: '1', name: 'Teste' },
  ];

  mockRepository.find.mockResolvedValue(fakeProducts);

  const result = await service.listProducts();

  expect(mockRepository.find).toHaveBeenCalledTimes(1);
  expect(result).toEqual(fakeProducts);
});

it ('deve retornar um produto pelo ID', async () => {
  const fakeProduct = {
    id: '1',
    name: 'Teste'
  };

  mockRepository.findOne.mockResolvedValue(fakeProduct);

  const result = await service.findProductById('1');

  expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
  expect(result).toEqual(fakeProduct);


});

it('deve lançar erro quando o produto não existir', async () => {
  mockRepository.findOne.mockResolvedValue(null);

  await expect(
    service.findProductById('999')
  ).rejects.toThrow('Produto não encontrado');

  expect(mockRepository.findOne).toHaveBeenCalledTimes(1);

});

it('deve criar um novo produto', async () => {
  const data = {
    name: 'Notebook',
    sku: 'NB001',
    quantity: 10,
    price: 3000,
    sellPrice: 3500,
  };

  mockRepository.create.mockReturnValue(data);
  mockRepository.save.mockResolvedValue(data);

  const result = await service.createProduct(data);

  expect(mockRepository.create).toHaveBeenCalledWith(data);
  expect(mockRepository.save).toHaveBeenCalled();
  expect(result).toEqual(data);
});

it('deve atualizar um produto', async () => {
  const product = {
    id: '1',
    name: 'Notebook',
    sku: 'NB001',
    quantity: 10,
    price: 3000,
    sellPrice: 3500,
  };

  const updateProduct = {
    ...product,
    price: 3200,
  };
  
  mockRepository.findOne 
   .mockResolvedValueOnce(product)
   .mockResolvedValueOnce(updateProduct)

  mockRepository.update.mockResolvedValue({ affected: 1});

  const result = await service.updateProduct('1', {
    price: 3200,
  });

  expect(mockRepository.update).toHaveBeenCalledWith('1', {
    price: 3200,  
  });

  expect(result).toEqual(updateProduct);
});


it('deve excluir um produto', async () => {
  const product = {
    id: '1',
    name: 'Notebook',
    sku: 'NB001',
    quantity: 10,
    price: 3000,
    sellPrice: 3500,
  };

  mockRepository.findOne.mockResolvedValue(product);
  mockRepository.delete.mockResolvedValue({ affected: 1});

  const result = await service.deleteProduct('1');

  expect(mockRepository.delete).toHaveBeenCalledWith('1');
  expect(result).toEqual({success: true});
});

it('deve listar produtos filtrando por nome', async () => {
  mockRepository.find.mockResolvedValue([]);

  await service.listProducts({
    name: 'Note',
  });

  expect(mockRepository.find).toHaveBeenCalledWith({
    where: {
      name: expect.anything(),
    },
  });
});

it('deve listar produtos filtrando por nome', async () => {
  mockRepository.find.mockResolvedValue([]);

  await service.listProducts({
    sku: 'ABC',
  });

  expect(mockRepository.find).toHaveBeenCalledWith({
    where: {
      sku: expect.anything(),
    },
  });
});

it('deve lançar erro quando o SKU já existir', async () => {
  mockRepository.findOne.mockResolvedValue({
    id: '1',
    sku: 'ABC123',
  });

  await expect(
    service.createProduct({
    name: 'Notebook',
    sku: 'ABC123',
    quantity: 10,
    price: 3000,
    sellPrice: 3500,
    })
  ).rejects.toThrow('SKU já cadastrado');

  expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
});

it('deve lançar erro quando o preço for maior que o preço de venda', async () => {
  mockRepository.findOne.mockResolvedValue(null);

  await expect(
    service.createProduct({
      name: 'Notebook',
      sku: 'ABC123',
      quantity: 10,
      price: 4000,
      sellPrice: 3000,
    })
  ).rejects.toThrow('O preço não pode ser maior que o preço de venda');
});

it('deve lançar erro quando a quantidade for menor que zero', async () => {
  mockRepository.findOne.mockResolvedValue(null);

  await expect(
    service.createProduct({
      name: 'Notebook',
      sku: 'ABC123',
      quantity: -5,
      price: 3000,
      sellPrice: 3500,
    })
  ).rejects.toThrow('Quantidade não pode ser menor que zero');
});



});