import ProductAdminFacade from "../facade/product-admin.facade";
import ProductRepository from "../repository/product.repository";
import AddProductUseCase from "../usecase/add-product/add-product.usecase";
import CheckStockUseCase from "../usecase/check-stock/check-stock.usecase";

export default class ProductAdmFacadeFactory {
  static create() {
    const productRepository = new ProductRepository();
    return new ProductAdminFacade({
      addUseCase: new AddProductUseCase(productRepository),
      checkStockUseCase: new CheckStockUseCase(productRepository),
    });
  }
}
