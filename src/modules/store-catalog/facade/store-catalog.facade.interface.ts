export interface FindStoreCatalogFacadeInputDto {
  id: string;
}

export interface FindStoreCatalogFacadeOutputDto {
  id: string;
  name: string;
  description: string;
  salesPrice: number;
}

export interface FindAllProductsFacadeDto {
  products: FindStoreCatalogFacadeOutputDto[];
}

export default interface StoreCatalogFacadeInterface {
  find(
    input: FindStoreCatalogFacadeInputDto
  ): Promise<FindStoreCatalogFacadeOutputDto>;
  findAll(): Promise<FindAllProductsFacadeDto>;
}
