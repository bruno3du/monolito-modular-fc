import { object } from "yup";
import { AddProductInputDto } from "./add-product.dto";
import AddProductUseCase from "./add-product.usecase";

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
  };
};
describe("Add Product usecase unit test", () => {
  it("should add a product", async () => {
    const input: AddProductInputDto = {
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
    };
    const productRepository = MockRepository();
    const usecase = new AddProductUseCase(productRepository);
    const result = await usecase.execute(input);

    expect(productRepository.add).toHaveBeenCalled();
    expect(result).toEqual(expect.objectContaining(input));
  });
  it("should throw an error if product is invalid", async () => {});
});
