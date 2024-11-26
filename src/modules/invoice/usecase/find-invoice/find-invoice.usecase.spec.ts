import Id from "../../../@shared/domain/value-object/id.value-object";
import FindInvoiceUseCase from "./find-invoice.usecase";

const invoice = {
  id: new Id("1"),
  name: "Invoice 1",
  document: "Document 1",
  total: 30,
  address: {
    city: "City 1",
    complement: "Complement 1",
    number: "Number 1",
    state: "State 1",
    street: "Street 1",
    zipCode: "Zip Code 1",
  },
  items: [
    {
      id: new Id("1"),
      name: "Item 1",
      price: 10,
    },
    {
      id: new Id("2"),
      name: "Item 2",
      price: 20,
    },
  ],
};

const MockRepository = () => ({
  find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
  generate: jest.fn(),
});
describe("Find Invoice Use Case Unit Tests", () => {
  it("should find a invoice", async () => {
    const invoiceRepository = MockRepository();
    const findInvoiceUseCase = new FindInvoiceUseCase(invoiceRepository);
    const input = { id: "1" };
    const output = await findInvoiceUseCase.execute(input);

    expect(output.id).toEqual("1");
    expect(output.name).toEqual("Invoice 1");
    expect(output.document).toEqual("Document 1");
    expect(output.street).toEqual("Street 1");
    expect(output.number).toEqual("Number 1");
    expect(output.city).toEqual("City 1");
    expect(output.state).toEqual("State 1");
    expect(output.complement).toEqual("Complement 1");
    expect(output.zipCode).toEqual("Zip Code 1");
    expect(output.total).toEqual(30);
    expect(output.items).toEqual(
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
