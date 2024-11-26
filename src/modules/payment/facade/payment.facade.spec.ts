import { Sequelize } from "sequelize-typescript";
import ProcessPaymentUseCase from "../usecase/process-payment/process-payment.usecase";
import PaymentFacade from "./payment.facade";
import TransactionRepository from "../repository/transaction.repository";
import TransactionModel from "../repository/transaction.model";
import PaymentFacadeFactory from "../factory/facade.factory";

describe("Payment Facade unit test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([TransactionModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should process a payment", async () => {
    const facade = PaymentFacadeFactory.create();
    const input = {
      orderId: "1",
      amount: 100,
    };

    const output = await facade.processPayment(input);
    expect(output.transactionId).toBeDefined();
    expect(output.orderId).toBe(input.orderId);
    expect(output.amount).toBe(100);
    expect(output.status).toBe("approved");
  });
});
