import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

type ProductProps = {
  id?: Id;
  name: string;
  description: string;
  salesPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Product extends BaseEntity implements AggregateRoot {
  private _name: string;
  private _description: string;
  private _salesPrice: number;
  constructor(props: ProductProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._name = props.name;
    this._salesPrice = props.salesPrice;
    this._description = props.description;
  }
  get name(): string {
    return this._name;
  }

  get salesPrice(): number {
    return this._salesPrice;
  }

  get description(): string {
    return this._description;
  }
}
