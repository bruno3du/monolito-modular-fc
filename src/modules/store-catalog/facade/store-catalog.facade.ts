import { FindAllProductsOutputDto } from "../usecase/find-all-products/find-all-products.dto";
import FindAllProductsUseCase from "../usecase/find-all-products/find-all-products.usecase.";
import {
  FindProductInputDto,
  FindProductOutputDto,
} from "../usecase/find-product/find-product.dto";
import FindProductUseCase from "../usecase/find-product/find-product.usecase";
import StoreCatalogFacadeInterface from "./store-catalog.facade.interface";

interface StoreCatalogFacadeProps {
  findUseCase: FindProductUseCase;
  findAllUseCase: FindAllProductsUseCase;
}
export default class StoreCatalogFacade implements StoreCatalogFacadeInterface {
  private findUseCase: FindProductUseCase;
  private findAllUseCase: FindAllProductsUseCase;
  constructor({ findUseCase, findAllUseCase }: StoreCatalogFacadeProps) {
    this.findUseCase = findUseCase;
    this.findAllUseCase = findAllUseCase;
  }

  async find({ id }: FindProductInputDto): Promise<FindProductOutputDto> {
    return await this.findUseCase.execute({ id });
  }

  async findAll(): Promise<FindAllProductsOutputDto> {
    return await this.findAllUseCase.execute();
  }
}
