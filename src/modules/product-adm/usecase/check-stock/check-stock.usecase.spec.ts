import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product/product.entity";
import CheckStockUseCase from "./check-stock.usecase";

const input = {
  id: new Id("1"),
  name: "Product 1",
  description: "Product 1 description",
  purchasePrice: 100,
  stock: 10,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const product = new Product(input);

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
  };
};

describe("Product Admin Check Stock Use Case", () => {
  it("should check stock", async () => {
    const productRepository = MockRepository();
    const usecase = new CheckStockUseCase(productRepository);

    const result = await usecase.execute({
      id: "1",
    });

    expect(productRepository.find).toHaveBeenCalled();
    expect(result.stock).toEqual(input.stock);
    expect(result.id).toEqual(input.id.id);
  });
});
