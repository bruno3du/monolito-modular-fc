import Id from "../../../@shared/domain/value-object/id.value-object";
import { Transaction } from "../../domain/transaction";
import ProcessPaymentUseCase from "./process-payment.usecase";

const MockRepository = ({ amount }: { amount: number }) => {
  const transaction = new Transaction({
    id: new Id("1"),
    amount,
    orderId: "1",
  });

  transaction.process();

  return {
    save: jest.fn().mockImplementation(() => {
      return Promise.resolve(transaction);
    }),
  };
};
describe("Process Payment UseCase Unit Tests", () => {
  it("should process a payment", async () => {
    const input = {
      orderId: "1",
      amount: 100,
    };
    const repository = MockRepository({
      amount: input.amount,
    });

    const usecase = new ProcessPaymentUseCase(repository);

    const output = await usecase.execute(input);
    expect(output.transactionId).toBe(input.orderId);
    expect(repository.save).toHaveBeenCalled();
    expect(output.orderId).toBe("1");
    expect(output.amount).toBe(100);
    expect(output.status).toBe("approved");
  });

  it("should decline a payment", async () => {
    const input = {
      orderId: "1",
      amount: 10,
    };
    const repository = MockRepository({
      amount: input.amount,
    });

    const usecase = new ProcessPaymentUseCase(repository);

    const output = await usecase.execute(input);
    expect(output.transactionId).toBe(input.orderId);
    expect(repository.save).toHaveBeenCalled();
    expect(output.orderId).toBe("1");
    expect(output.amount).toBe(10);
    expect(output.status).toBe("declined");
  });
});
