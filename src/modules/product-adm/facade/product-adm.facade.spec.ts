import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../repository/product.model";
import ProductAdmFacadeFactory from "../factory/facade.factory";

let sequelize: Sequelize;
describe("Product Admin Facade unit test", () => {
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
  it("should create a product", async () => {
    const facade = ProductAdmFacadeFactory.create();
    const input = {
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
    };

    await facade.addProduct(input);

    const product = await ProductModel.findOne({ where: { id: "1" } });

    expect(product).toBeDefined();
    expect(product.name).toEqual(input.name);
  });

  it("should check stock", async () => {
    const facade = ProductAdmFacadeFactory.create();
    const input01 = {
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const input02 = {
      id: "2",
      name: "Product 2",
      description: "Product 2 description",
      purchasePrice: 200,
      stock: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await ProductModel.create(input01);
    await ProductModel.create(input02);

    const result01 = await facade.checkStock({
      id: "1",
    });
    const result02 = await facade.checkStock({
      id: "2",
    });

    expect(result01.stock).toEqual(input01.stock);
    expect(result02.stock).toEqual(input02.stock);
  });
});
