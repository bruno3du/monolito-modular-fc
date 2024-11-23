import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ProductGateway from "../../gateway/products.gateway";
import { FindProductInputDto, FindProductOutputDto } from "./find-product.dto";

export default class FindProductUseCase implements UseCaseInterface {
  constructor(private _productRepository: ProductGateway) {}
  async execute({ id }: FindProductInputDto): Promise<FindProductOutputDto> {
    const product = await this._productRepository.find(id);
    return {
      id: product.id.id,
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    };
  }
}
