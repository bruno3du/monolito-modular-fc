import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import { InvoiceItems } from "../../domain/invoice-items.entity";
import Invoice from "../../domain/invoice.entity";
import { GenerateInvoiceUseCaseInputDto } from "./generate-invoice.dto";
import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const items = [
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
];

const invoice = new Invoice({
  id: new Id("1"),
  document: "Document 1",
  name: "Invoice 1",
  address: new Address({
    street: "Street 1",
    number: "Number 1",
    complement: "Complement 1",
    city: "City 1",
    state: "State 1",
    zipCode: "Zip Code 1",
  }),
  items: items.map(
    (ele) =>
      new InvoiceItems({
        id: new Id(ele.id),
        name: ele.name,
        price: ele.price,
      })
  ),
});

const MockRepository = () => ({
  find: jest.fn(),
  generate: jest.fn().mockReturnValue(Promise.resolve(invoice)),
});
describe("Generate invoice usecase Unit Tests", () => {
  it("should generate a invoice", async () => {
    const invoiceRepository = MockRepository();
    const usecase = new GenerateInvoiceUseCase(invoiceRepository);
    const input: GenerateInvoiceUseCaseInputDto = {
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
    const output = await usecase.execute(input);

    expect(invoiceRepository.generate).toHaveBeenCalled();
    expect(output).toEqual({
      id: "1",
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
