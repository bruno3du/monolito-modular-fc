import FindProductUseCase from "./find-product.usecase";

const product = {
  id: "1",
  name: "Product 1",
  description: "Product 1 description",
  salesPrice: 100,
};

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    findAll: jest.fn(),
  };
};
describe("Find Product Use Case unit test", () => {
  it("should find product", async () => {
    const productRepository = MockRepository();
    const usecase = new FindProductUseCase(productRepository);
    const productFound = await usecase.execute({ id: "1" });

    expect(productFound).toBeDefined();
    expect(productFound.name).toEqual(product.name);
  });
});
