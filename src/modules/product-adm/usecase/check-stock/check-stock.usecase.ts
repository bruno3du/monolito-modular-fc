import ProductGateway from "../../gateway/product.gateway";
import { CheckStockInputDto, CheckStockOutputDto } from "./check-stock.dto";

export default class CheckStockUseCase {
  constructor(private _productRepository: ProductGateway) {}
  async execute({ id }: CheckStockInputDto): Promise<CheckStockOutputDto> {
    const product = await this._productRepository.find(id);
    if (!product) throw new Error("Product not found");

    return {
      id: product.id.id,
      stock: product.stock,
    };
  }
}
