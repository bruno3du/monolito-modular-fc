import ClientFacade from "../facade/client-adm.facade";
import ClientRepository from "../repository/client.repository";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import FindClientUseCase from "../usecase/find-client/find-client.usecase";

export default class ClientFacadeFactory {
  static create() {
    const clientRepository = new ClientRepository();
    return new ClientFacade(
      new AddClientUseCase(clientRepository),
      new FindClientUseCase(clientRepository)
    );
  }
}
