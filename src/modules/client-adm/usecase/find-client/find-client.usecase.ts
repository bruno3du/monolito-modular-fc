import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientGateway from "../../gateway/client.gateway";
import { FindClientInputDto, FindClientOutputDto } from "./find-client.dto";

export default class FindClientUseCase implements UseCaseInterface {
  constructor(private _clientRepository: ClientGateway) {}
  async execute(input: FindClientInputDto): Promise<FindClientOutputDto> {
    const client = await this._clientRepository.find(input.id);

    return {
      name: client.name,
      city: client.address.city,
      complement: client.address.complement,
      number: client.address.number,
      state: client.address.state,
      street: client.address.street,
      zipCode: client.address.zipCode,
      email: client.email,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      id: client.id.id,
    };
  }
}
