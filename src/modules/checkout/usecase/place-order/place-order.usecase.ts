import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientEntity from "../../../client-adm/domain/client.entity";
import { ClientFacadeInterface } from "../../../client-adm/facade/client-adm.facade.interface";
import {
  GenerateInvoiceFacadeOutputDto,
  InvoiceFacadeInterface,
} from "../../../invoice/facade/invoice.facade.interface";
import { PaymentFacadeInterface } from "../../../payment/facade/payment.facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import { Order } from "../../domain/order.entity";
import { Product } from "../../domain/product.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import {
  PlaceOrderUseCaseInputDto,
  PlaceOrderUseCaseOutputDto,
} from "./place-order.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
  constructor(
    private _clientFacade: ClientFacadeInterface,
    private _productFacade: ProductAdmFacadeInterface,
    private _storeCatalogFacade: StoreCatalogFacadeInterface,
    private _checkoutRepository: CheckoutGateway,
    private _invoiceFacade: InvoiceFacadeInterface,
    private _paymentFacade: PaymentFacadeInterface
  ) {}

  async execute(
    input: PlaceOrderUseCaseInputDto
  ): Promise<PlaceOrderUseCaseOutputDto> {
    const client = await this._clientFacade.findClient({ id: input.clientId });

    if (!client) throw new Error("Client not found");

    await this.validateProducts(input);

    const products = await Promise.all(
      input.products.map((product) => this.getProduct(product.productId))
    );

    const myClient = new ClientEntity({
      id: new Id(client.id),
      name: client.name,
      email: client.email,
      address: new Address({
        complement: client.complement,
        street: client.street,
        number: client.number,
        city: client.city,
        state: client.state,
        zipCode: client.zipCode,
      }),
    });

    const order = new Order({
      client: myClient,
      products,
    });

    const payment = await this._paymentFacade.processPayment({
      orderId: order.id.id,
      amount: order.total,
    });

    let invoice: GenerateInvoiceFacadeOutputDto = null;

    if (payment.status === "approved") {
      invoice = await this._invoiceFacade.generateInvoice({
        city: client.city,
        complement: client.complement,
        document: client.email,
        name: client.name,
        number: client.number,
        state: client.state,
        street: client.street,
        zipCode: client.zipCode,
        id: order.id.id,
        items: products.map((product) => {
          return {
            name: product.name,
            price: product.salesPrice,
            id: product.id.id,
          };
        }),
      });

      order.approved();
    }

    await this._checkoutRepository.addOrder(order);

    /// process payment ->

    // caso patgamento seja aprovado -> gerar invoice
    // mudar o statyus da minha order para approved
    // retornar dto

    return {
      id: order.id.id,
      invoiceId: invoice?.id || null,
      status: order.status,
      total: order.total,
      products: order.products.map((product) => {
        return {
          productId: product.id.id,
        };
      }),
    };
  }

  private async validateProducts(input: PlaceOrderUseCaseInputDto) {
    if (input.products.length === 0) {
      throw new Error("No products selected");
    }

    for (const product of input.products) {
      const findProduct = await this._productFacade.checkStock({
        id: product.productId,
      });

      if (findProduct.stock === 0) {
        throw new Error(`Product ${product.productId} is out of stock`);
      }
    }
  }

  private async getProduct(productId: string): Promise<Product> {
    const findProduct = await this._storeCatalogFacade.find({
      id: productId,
    });

    if (!findProduct) {
      throw new Error("Product not found");
    }

    return new Product({
      id: new Id(findProduct.id),
      name: findProduct.name,
      description: findProduct.description,
      salesPrice: findProduct.salesPrice,
    });
  }
}
