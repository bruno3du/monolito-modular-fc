import Invoice from "../domain/invoice.entity";
import { InvoiceGateway } from "./../gateway/invoice.gateway";
import { Table } from "sequelize-typescript";
import { InvoiceItemsModel, InvoiceModel } from "./invoice.model";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address.value-object";
import { InvoiceItems } from "../domain/invoice-items.entity";

@Table({
  tableName: "invoice",
  timestamps: false,
})
export class InvoiceRepository implements InvoiceGateway {
  async find(id: string): Promise<Invoice> {
    const findInvoice = await InvoiceModel.findOne({
      where: { id },
      include: [InvoiceItemsModel],
    });

    return new Invoice({
      id: new Id(findInvoice.id),
      name: findInvoice.name,
      document: findInvoice.document,
      address: new Address({
        city: findInvoice.city,
        complement: findInvoice.complement,
        number: findInvoice.number,
        state: findInvoice.state,
        street: findInvoice.street,
        zipCode: findInvoice.zipCode,
      }),
      items: findInvoice.items.map((ele) => {
        return new InvoiceItems({
          id: new Id(ele.id),
          name: ele.name,
          price: ele.price,
        });
      }),
    });
  }
  async generate(input: Invoice): Promise<Invoice> {
    const generateInvoice = await InvoiceModel.create(
      {
        id: input.id.id,
        name: input.name,
        document: input.document,
        address: input.address.street,
        city: input.address.city,
        complement: input.address.complement,
        street: input.address.street,
        number: input.address.number,
        state: input.address.state,
        zipCode: input.address.zipCode,
        total: input.items.reduce((acc, ele) => acc + ele.price, 0),
        items: input.items.map((ele) => {
          return {
            id: ele.id.id,
            name: ele.name,
            price: ele.price,
          };
        }),
      },
      {
        include: [InvoiceItemsModel],
      }
    );

    return new Invoice({
      id: new Id(generateInvoice.id),
      name: generateInvoice.name,
      document: generateInvoice.document,
      address: new Address({
        city: generateInvoice.city,
        complement: generateInvoice.complement,
        number: generateInvoice.number,
        state: generateInvoice.state,
        street: generateInvoice.street,
        zipCode: generateInvoice.zipCode,
      }),
      items: generateInvoice.items.map((ele) => {
        return new InvoiceItems({
          id: new Id(ele.id),
          name: ele.name,
          price: ele.price,
        });
      }),
    });
  }
}
