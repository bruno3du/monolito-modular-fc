import InvoiceFacade from "../facade/invoice.facade";
import { InvoiceRepository } from "../repository/invoice.repository";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";

export class InvoiceFacadeFactory {
  static create() {
    const repository = new InvoiceRepository();
    return new InvoiceFacade(
      new FindInvoiceUseCase(repository),
      new GenerateInvoiceUseCase(repository)
    );
  }
}
