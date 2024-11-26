import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import { InvoiceItems } from "../../domain/invoice-items.entity";
import Invoice from "../../domain/invoice.entity";
import { InvoiceGateway } from "../../gateway/invoice.gateway";
import {
  GenerateInvoiceUseCaseInputDto,
  GenerateInvoiceUseCaseOutputDto,
} from "./generate-invoice.dto";

export default class GenerateInvoiceUseCase implements UseCaseInterface {
  constructor(private readonly _invoiceRepository: InvoiceGateway) {}
  async execute(
    input: GenerateInvoiceUseCaseInputDto
  ): Promise<GenerateInvoiceUseCaseOutputDto> {
    const createInvoice = new Invoice({
      name: input.name,
      document: input.document,
      address: new Address({
        street: input.street,
        number: input.number,
        complement: input.complement,
        city: input.city,
        state: input.state,
        zipCode: input.zipCode,
      }),
      items: input.items.map(
        (ele) =>
          new InvoiceItems({
            id: new Id(ele.id),
            name: ele.name,
            price: ele.price,
          })
      ),
    });
    const invoice = await this._invoiceRepository.generate(createInvoice);

    return {
      id: invoice.id.id,
      city: invoice.address.city,
      complement: invoice.address.complement,
      number: invoice.address.number,
      state: invoice.address.state,
      street: invoice.address.street,
      zipCode: invoice.address.zipCode,
      total: invoice.items.reduce((acc, ele) => acc + ele.price, 0),
      name: invoice.name,
      document: invoice.document,
      items: invoice.items.map((ele) => ({
        id: ele.id.id,
        name: ele.name,
        price: ele.price,
      })),
    };
  }
}
