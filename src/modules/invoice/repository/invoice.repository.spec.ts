import { Sequelize } from "sequelize-typescript";
import { InvoiceRepository } from "./invoice.repository";
import Invoice from "../domain/invoice.entity";
import Address from "../../@shared/domain/value-object/address.value-object";
import { InvoiceItems } from "../domain/invoice-items.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import { InvoiceItemsModel, InvoiceModel } from "./invoice.model";

describe("Invoice repository unit test", () => {
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

  it("should generate an invoice", async () => {
    const invoiceRepository = new InvoiceRepository();

    const invoice = new Invoice({
      id: new Id("1"),
      name: "Invoice 1",
      document: "Document 1",
      address: new Address({
        street: "Street 1",
        number: "Number 1",
        complement: "Complement 1",
        city: "City 1",
        state: "State 1",
        zipCode: "Zip Code 1",
      }),
      items: [
        new InvoiceItems({
          id: new Id("1"),
          name: "Item 1",
          price: 10,
        }),
        new InvoiceItems({
          id: new Id("2"),
          name: "Item 2",
          price: 20,
        }),
      ],
    });

    await invoiceRepository.generate(invoice);

    const invoiceDb = await InvoiceModel.findOne({
      where: { id: "1" },
      include: ["items"],
    });

    const items = invoiceDb.items?.map((ele) => {
      return {
        id: ele.id,
        name: ele.name,
        price: ele.price,
      };
    });

    expect(invoiceDb).toBeDefined();
    expect(invoiceDb.id).toBe("1");
    expect(invoiceDb.name).toBe("Invoice 1");
    expect(invoiceDb.document).toBe("Document 1");
    expect(invoiceDb.street).toBe("Street 1");
    expect(invoiceDb.number).toBe("Number 1");
    expect(invoiceDb.complement).toBe("Complement 1");
    expect(invoiceDb.city).toBe("City 1");
    expect(invoiceDb.state).toBe("State 1");
    expect(invoiceDb.zipCode).toBe("Zip Code 1");
    expect(invoiceDb.total).toBe(30);
    expect(items).toEqual(
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
});
