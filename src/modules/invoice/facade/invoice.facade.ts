import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import {
  FindInvoiceFacadeInputDto,
  FindInvoiceFacadeOutputDto,
  GenerateInvoiceFacadeInputDto,
  GenerateInvoiceFacadeOutputDto,
  InvoiceFacadeInterface,
} from "./invoice.facade.interface";

export default class InvoiceFacade implements InvoiceFacadeInterface {
  constructor(
    private readonly _findInvoiceUseCase: FindInvoiceUseCase,
    private readonly _generateInvoiceUseCase: GenerateInvoiceUseCase
  ) {}
  async findInvoice(
    input: FindInvoiceFacadeInputDto
  ): Promise<FindInvoiceFacadeOutputDto> {
    const output = await this._findInvoiceUseCase.execute(input);
    return output;
  }
  async generateInvoice(
    input: GenerateInvoiceFacadeInputDto
  ): Promise<GenerateInvoiceFacadeOutputDto> {
    const output = await this._generateInvoiceUseCase.execute(input);

    return {
      id: output.id,
      name: output.name,
      document: output.document,
      street: output.street,
      number: output.number,
      city: output.city,
      state: output.state,
      complement: output.complement,
      items: output.items,
      total: output.total,
      zipCode: output.zipCode,
    };
  }
}
