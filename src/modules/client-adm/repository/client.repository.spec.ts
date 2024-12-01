import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "./client.model";
import ClientRepository from "./client.repository";
import ClientEntity from "../domain/client.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address.value-object";

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

  it("should create a client", async () => {
    const clientRepository = new ClientRepository();

    const client = new ClientEntity({
      id: new Id("1"),
      name: "Client 1",
      email: "x@x.com",
      address: new Address({
        city: "City 1",
        complement: "Complement 1",
        number: "Number 1",
        state: "State 1",
        street: "Street 1",
        zipCode: "ZipCode 1",
      }),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await clientRepository.add(client);

    const clientFound = await ClientModel.findOne({ where: { id: "1" } });
    expect(clientFound).toBeDefined();
    expect(clientFound.name).toEqual(client.name);
  });

  it("should find a client", async () => {
    const clientRepository = new ClientRepository();

    const input = "1";

    await ClientModel.create({
      id: input,
      name: "Client 1",
      email: "x@x.com",
      city: "City 1",
      state: "State 1",
      street: "Street 1",
      number: "Number 1",
      zipCode: "ZipCode 1",
      complement: "Complement 1",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const client = await clientRepository.find(input);

    expect(client.id.id).toEqual(input);
  });
});
