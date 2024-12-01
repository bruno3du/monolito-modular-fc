import Id from "../../../@shared/domain/value-object/id.value-object";
import {
  AddClientFacadeInputDto,
  ClientFacadeInterface,
} from "../../../client-adm/facade/client-adm.facade.interface";
import StoreCatalogFacadeInterface, {
  FindStoreCatalogFacadeOutputDto,
} from "../../../store-catalog/facade/store-catalog.facade.interface";
import { Product } from "../../domain/product.entity";
import { PlaceOrderUseCaseInputDto } from "./place-order.dto";
import PlaceOrderUseCase from "./place-order.usecase";

const mockDate = new Date(2000, 1, 1);
describe("Place order usecase unit test", () => {
  describe("validateProducts method", () => {
    // @ts-expect-error - no params in constructor
    const usecase = new PlaceOrderUseCase();

    it("should throw an error if products are selected", async () => {
      const input: PlaceOrderUseCaseInputDto = {
        clientId: "0",
        products: [],
      };

      await expect(usecase["validateProducts"](input)).rejects.toThrow(
        new Error("No products selected")
      );
    });

    it("should throw an error if products are out of stock", async () => {
      const mockProductFacade = {
        checkStock: jest.fn(({ id }: { id: string }) => {
          return Promise.resolve({
            id,
            stock: id === "1" ? 0 : 1,
          });
        }),
      };

      // @ts-expect-error - force set productFacade
      usecase["_productFacade"] = mockProductFacade;

      let input: PlaceOrderUseCaseInputDto = {
        clientId: "0",
        products: [{ productId: "1" }],
      };

      await expect(usecase["validateProducts"](input)).rejects.toThrow(
        new Error("Product 1 is out of stock")
      );

      input = {
        clientId: "0",
        products: [{ productId: "0" }, { productId: "1" }],
      };

      await expect(usecase["validateProducts"](input)).rejects.toThrow(
        new Error("Product 1 is out of stock")
      );

      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3);

      input = {
        clientId: "0",
        products: [{ productId: "0" }, { productId: "1" }, { productId: "2" }],
      };

      await expect(usecase["validateProducts"](input)).rejects.toThrow(
        new Error("Product 1 is out of stock")
      );
      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5);
    });
  });

  describe("getProducts method", () => {
    // @ts-expect-error - no params in constructor
    const placeOrderUseCase = new PlaceOrderUseCase();
    beforeAll(() => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it("should throw an error when product is not found", async () => {
      const mockCatalogFacade: Pick<StoreCatalogFacadeInterface, "find"> = {
        find: jest.fn().mockResolvedValue(null),
      };

      // @ts-expect-error - force set _storeCatalogFacade
      placeOrderUseCase["_storeCatalogFacade"] = mockCatalogFacade;

      await expect(placeOrderUseCase["getProduct"]("0")).rejects.toThrow(
        new Error("Product not found")
      );
    });

    it("should return a product", async () => {
      const output: FindStoreCatalogFacadeOutputDto = {
        description: "Product 1",
        id: "1",
        name: "Product 1",
        salesPrice: 100,
      };
      const input = output.id;
      const mockCatalogFacade: Pick<StoreCatalogFacadeInterface, "find"> = {
        find: jest.fn().mockResolvedValue(output),
      };

      // @ts-expect-error - force set _storeCatalogFacade
      placeOrderUseCase["_storeCatalogFacade"] = mockCatalogFacade;

      const product = await placeOrderUseCase["getProduct"](input);

      expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1);
      expect(product).toEqual(
        new Product({
          id: new Id(input),
          name: output.name,
          description: output.description,
          salesPrice: output.salesPrice,
        })
      );
    });
  });
  describe("execute method", () => {
    it("should throw an error if client is not found", async () => {
      const mockClientFacade = {
        findClient: jest.fn().mockResolvedValue(null),
      };

      const input: PlaceOrderUseCaseInputDto = {
        clientId: "0",
        products: [],
      };

      // @ts-expect-error - no params in constructor
      const usecase = new PlaceOrderUseCase();
      // @ts-expect-error - force set clientFacade
      usecase["_clientFacade"] = mockClientFacade;
      await expect(usecase.execute(input)).rejects.toThrow(
        new Error("Client not found")
      );
    });

    it("should throw an error when products are not valids", async () => {
      const mockClientFacade = {
        findClient: jest.fn().mockResolvedValue(true),
      };

      const input: PlaceOrderUseCaseInputDto = {
        clientId: "1",
        products: [],
      };

      // @ts-expect-error - no params in constructor
      const usecase = new PlaceOrderUseCase();
      // @ts-expect-error - force set clientFacade
      usecase["_clientFacade"] = mockClientFacade;

      const mockValidateProduct = jest
        // @ts-expect-error - spy on private method
        .spyOn(usecase, "validateProducts")
        // @ts-expect-error - not return never
        .mockRejectedValue(new Error("No products selected"));

      await expect(usecase.execute(input)).rejects.toThrow(
        new Error("No products selected")
      );
      expect(mockValidateProduct).toHaveBeenCalledTimes(1);
    });

    describe("place an order", () => {
      const clientProps = {
        id: "1",
        name: "Client 1",
        document: "0000",
        email: "1@1.com",
        street: "Street 1",
        number: "1",
        complement: "Complement 1",
        city: "City 1",
        state: "State 1",
        zipCode: "Zip Code 1",
      };

      const mockClientFacade = {
        findClient: jest.fn().mockResolvedValue(clientProps),
        addClient: jest.fn(),
      };

      const mockPaymentFacade = {
        processPayment: jest.fn(),
      };

      const mockCheckoutRepo = {
        addOrder: jest.fn(),
        findOrder: jest.fn().mockResolvedValue(null),
      };

      const mockInvoiceFacade = {
        generateInvoice: jest.fn().mockResolvedValue({ id: "1i" }),
        findInvoice: jest.fn(),
      };

      const placeOrderUseCase = new PlaceOrderUseCase(
        mockClientFacade,
        null,
        null,
        mockCheckoutRepo,
        mockInvoiceFacade,
        mockPaymentFacade
      );

      const products = {
        "1": new Product({
          id: new Id("1"),
          name: "Product 1",
          description: "Product 1 description",
          salesPrice: 100,
        }),
        "2": new Product({
          id: new Id("2"),
          name: "Product 2",
          description: "Product 2 description",
          salesPrice: 200,
        }),
      };

      const mockValidateProducts = jest
        // @ts-expect-error - spy on private method
        .spyOn(placeOrderUseCase, "validateProducts")
        // @ts-expect-error - spy on private method
        .mockResolvedValue(null);

      const mockGetProducts = jest
        // @ts-expect-error - spy on private method
        .spyOn(placeOrderUseCase, "getProduct")
        // @ts-expect-error - spy on private method
        .mockImplementation((productId: keyof typeof products) => {
          return products[productId];
        });

      it("should not be approved", async () => {
        mockPaymentFacade.processPayment =
          mockPaymentFacade.processPayment.mockReturnValue({
            transactionId: "1t",
            orderId: "1o",
            amount: 100,
            status: "error",
            createdAt: new Date(),
            updatedAt: new Date(),
          });

        const input: PlaceOrderUseCaseInputDto = {
          clientId: "1c",
          products: [{ productId: "1" }, { productId: "2" }],
        };

        let output = await placeOrderUseCase.execute(input);

        expect(output.invoiceId).toBeNull();
        expect(output.total).toBe(300);
        expect(output.products).toStrictEqual([
          { productId: "1" },
          { productId: "2" },
        ]);
        expect(mockClientFacade.findClient).toHaveBeenCalledTimes(1);
        expect(mockClientFacade.findClient).toHaveBeenCalledWith({ id: "1c" });
        expect(mockValidateProducts).toHaveBeenCalledTimes(1);
        expect(mockValidateProducts).toHaveBeenCalledWith(input);
        expect(mockGetProducts).toHaveBeenCalledTimes(2);
        expect(mockCheckoutRepo.addOrder).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.processPayment).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.processPayment).toHaveBeenCalledWith({
          orderId: output.id,
          amount: output.total,
        });
        expect(mockInvoiceFacade.generateInvoice).not.toHaveBeenCalled();
      });
    });
  });
});
