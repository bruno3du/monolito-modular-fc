import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import ClientFacadeFactory from "../factory/client-adm.facade.factory";
import { AddClientFacadeInputDto } from "./client-adm.facade.interface";

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
  });
  it("should find a client", async () => {
    const facade = ClientFacadeFactory.create();
    const input = {
      id: "1",
      name: "Client 1",
      email: "x@x.com",
      city: "City 1",
      state: "State 1",
      street: "Street 1",
      number: "Number 1",
      zipCode: "Zip Code 1",
      complement: "Complement 1",
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
    const input: AddClientFacadeInputDto = {
      id: "1",
      name: "Client 1",
      email: "x@x.com",
      city: "City 1",
      state: "State 1",
      street: "Street 1",
      number: "Number 1",
      zipCode: "Zip Code 1",
      complement: "Complement 1",
    };
    const output = await facade.addClient(input);

    expect(output).toBeDefined();
    expect(output).toEqual(expect.objectContaining(input));

    const client = await ClientModel.findOne({ where: { id: "1" } });

    expect(client).toBeDefined();
    expect(client).toEqual(expect.objectContaining(input));
  });
});
