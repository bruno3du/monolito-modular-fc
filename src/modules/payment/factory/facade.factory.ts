import PaymentFacade from "../facade/payment.facade";
import TransactionRepository from "../repository/transaction.repository";
import ProcessPaymentUseCase from "../usecase/process-payment/process-payment.usecase";

export default class PaymentFacadeFactory {
  static create() {
    const repository = new TransactionRepository();
    return new PaymentFacade(new ProcessPaymentUseCase(repository));
  }
}
