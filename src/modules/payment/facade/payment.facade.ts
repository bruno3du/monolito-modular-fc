import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import {
  PaymentFacadeInterface,
  ProcessPaymentFacadeInputDto,
  ProcessPaymentFacadeOutputDto,
} from "./payment.facade.interface";

export default class PaymentFacade implements PaymentFacadeInterface {
  constructor(private processPaymentUseCase: UseCaseInterface) {}
  async processPayment(
    input: ProcessPaymentFacadeInputDto
  ): Promise<ProcessPaymentFacadeOutputDto> {
    return await this.processPaymentUseCase.execute(input);
  }
}
