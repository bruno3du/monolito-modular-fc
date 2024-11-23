import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "./product.model";
import Product from "../domain/product/product.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import ProductRepository from "./product.repository";

describe("Product repository unit test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const productRepository = new ProductRepository();

    const product = new Product({
      id: new Id("1"),
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await productRepository.add(product);
    const productDb = await ProductModel.findOne({
      where: { id: product.id.id },
    });

    expect(productDb.id).toBeDefined();
    expect(productDb.name).toBe("Product 1");
    expect(productDb.description).toBe("Product 1 description");
    expect(productDb.purchasePrice).toBe(100);
    expect(productDb.stock).toBe(10);
    expect(productDb.createdAt).toBeInstanceOf(Date);
    expect(productDb.updatedAt).toBeInstanceOf(Date);
  });

  it("should find a product", async () => {
    const productRepository = new ProductRepository();

    ProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const product = await productRepository.find("1");

    expect(product.id.id).toEqual("1");
    expect(product.name).toEqual("Product 1");
    expect(product.description).toEqual("Product 1 description");
    expect(product.purchasePrice).toEqual(100);
    expect(product.stock).toEqual(10);
  });
});
