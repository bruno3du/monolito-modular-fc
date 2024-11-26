import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import { Transaction } from "../../domain/transaction";
import { PaymentGateway } from "../../gateway/payment.gateway";
import {
  ProcessPaymentInputDto,
  ProcessPaymentOutputDto,
} from "./process-payment.dto";

export default class ProcessPaymentUseCase implements UseCaseInterface {
  constructor(private readonly _transactionRepository: PaymentGateway) {}
  async execute(
    input: ProcessPaymentInputDto
  ): Promise<ProcessPaymentOutputDto> {
    const transaction = new Transaction(input);

    transaction.process();

    const savedTransaction = await this._transactionRepository.save(
      transaction
    );

    return {
      transactionId: savedTransaction.id.id,
      orderId: savedTransaction.orderId,
      amount: savedTransaction.amount,
      status: savedTransaction.status,
      createdAt: savedTransaction.createdAt,
      updatedAt: savedTransaction.updatedAt,
    };
  }
}
