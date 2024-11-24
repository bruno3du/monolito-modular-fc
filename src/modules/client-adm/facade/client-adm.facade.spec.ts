import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import ClientFacadeFactory from "../factory/client-adm.facade.factory";

describe("Client repository unit test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  })
  it("should find a client", async () => {
    const facade = ClientFacadeFactory.create();
    const input = {
      id: "1",
      name: "Client 1",
      email: "x@x.com",
      address: "Address 1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await ClientModel.create(input);

    const client = await facade.findClient({
      id: "1",
    });

    expect(client).toBeDefined();
    expect(client).toEqual(expect.objectContaining(input));
  });

  it("should add a client", async () => {
    const facade = ClientFacadeFactory.create();
    const input = {
      id: "1",
      name: "Client 1",
      email: "x@x.com",
      address: "Address 1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const output = await facade.addClient(input);

    expect(output).toBeDefined();
    expect(output).toEqual(expect.objectContaining(input));

    const client = await ClientModel.findOne({ where: { id: "1" } });

    expect(client).toBeDefined();
    expect(client).toEqual(expect.objectContaining(input));
  });
});
