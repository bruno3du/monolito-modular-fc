import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import { InvoiceItems } from "../../domain/invoice-items.entity";
import { InvoiceGateway } from "../../gateway/invoice.gateway";
import {
  FindInvoiceUseCaseInputDTO,
  FindInvoiceUseCaseOutputDTO,
} from "./find-invoice.dto";

export default class FindInvoiceUseCase implements UseCaseInterface {
  constructor(private readonly _invoiceRepository: InvoiceGateway) {}
  async execute(
    input: FindInvoiceUseCaseInputDTO
  ): Promise<FindInvoiceUseCaseOutputDTO> {
    const invoice = await this._invoiceRepository.find(input.id);

    return {
      id: invoice.id.id,
      total: invoice.items.reduce((acc, ele) => acc + ele.price, 0),
      createdAt: invoice.createdAt,
      name: invoice.name,
      city: invoice.address.city,
      complement: invoice.address.complement,
      number: invoice.address.number,
      state: invoice.address.state,
      street: invoice.address.street,
      zipCode: invoice.address.zipCode,
      document: invoice.document,
      items: invoice.items.map((ele) => ({
        id: ele.id.id,
        name: ele.name,
        price: ele.price,
      })),
    };
  }
}
