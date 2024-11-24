import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import FindClientUseCase from "../usecase/find-client/find-client.usecase";
import {
  AddClientFacadeInputDto,
  AddClientFacadeOutputDto,
  ClientFacadeInterface,
  FindClientFacadeInputDto,
  FindClientFacadeOutputDto,
} from "./client-adm.facade.interface";

export default class ClientFacade implements ClientFacadeInterface {
  constructor(
    private readonly _addClientUseCase: AddClientUseCase,
    private readonly _findClientUseCase: FindClientUseCase
  ) {}
  async addClient(
    input: AddClientFacadeInputDto
  ): Promise<AddClientFacadeOutputDto> {
    return await this._addClientUseCase.execute(input);
  }

  async findClient(
    input: FindClientFacadeInputDto
  ): Promise<FindClientFacadeOutputDto> {
    return await this._findClientUseCase.execute(input);
  }
}
