import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import ClientEntity from "../../client-adm/domain/client.entity";
import { Product } from "./product.entity";

type OrderProps = {
  id?: Id;
  client: ClientEntity;
  products: Product[];
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Order extends BaseEntity implements AggregateRoot {
  private _client: ClientEntity;
  private _products: Product[];
  private _status: string;

  constructor(props: OrderProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._client = props.client;
    this._products = props.products;
    this._status = props.status || "pending";
  }

  approved() {
    this._status = "approved";
  }

  get client(): ClientEntity {
    return this._client;
  }

  get products(): Product[] {
    return this._products;
  }

  get status(): string {
    return this._status;
  }

  get total(): number {
    return this._products.reduce((total, product) => {
      return total + product.salesPrice;
    }, 0);
  }
}
