import { Sequelize } from "sequelize-typescript";
import { InvoiceItemsModel, InvoiceModel } from "../repository/invoice.model";
import { InvoiceFacadeFactory } from "../factory/invoice.facade.factory";
import {
  FindInvoiceFacadeInputDto,
  GenerateInvoiceFacadeInputDto,
} from "./invoice.facade.interface";

describe("Invoice facade unit test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, InvoiceItemsModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });
  it("should find a invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

    const createInvoice = {
      id: "1",
      city: "City 1",
      complement: "Complement 1",
      number: "Number 1",
      document: "Document 1",
      total: 30,
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 10,
        },
        {
          id: "2",
          name: "Item 2",
          price: 20,
        },
      ],
      name: "Invoice 1",
      state: "State 1",
      street: "Street 1",
      zipCode: "Zip Code 1",
    };

    await InvoiceModel.create(createInvoice, {
      include: InvoiceItemsModel,
    });

    const invoice = await facade.findInvoice({
      id: "1",
    });

    expect(invoice.id).toEqual("1");
    expect(invoice.name).toEqual("Invoice 1");
    expect(invoice.document).toEqual("Document 1");
    expect(invoice.street).toEqual("Street 1");
    expect(invoice.number).toEqual("Number 1");
    expect(invoice.city).toEqual("City 1");
    expect(invoice.state).toEqual("State 1");
    expect(invoice.complement).toEqual("Complement 1");
    expect(invoice.zipCode).toEqual("Zip Code 1");
    expect(invoice.total).toEqual(30);
    expect(invoice.items).toEqual(
      expect.arrayContaining([
        {
          id: "1",
          name: "Item 1",
          price: 10,
        },
        {
          id: "2",
          name: "Item 2",
          price: 20,
        },
      ])
    );
  });

  it("should generate a invoice", async () => {
    const facade = InvoiceFacadeFactory.create();
    const input: GenerateInvoiceFacadeInputDto = {
      name: "Invoice 1",
      document: "Document 1",
      street: "Street 1",
      number: "Number 1",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "Zip Code 1",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 10,
        },
        {
          id: "2",
          name: "Item 2",
          price: 20,
        },
      ],
    };
    const output = await facade.generateInvoice(input);

    expect(output).toEqual({
      id: expect.any(String),
      name: "Invoice 1",
      document: "Document 1",
      street: "Street 1",
      number: "Number 1",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "Zip Code 1",
      total: 30,
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 10,
        },
        {
          id: "2",
          name: "Item 2",
          price: 20,
        },
      ],
    });
  });
});
