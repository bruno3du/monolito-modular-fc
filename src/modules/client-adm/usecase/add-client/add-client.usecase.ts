import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientEntity from "../../domain/client.entity";
import ClientGateway from "../../gateway/client.gateway";
import { AddClientInputDto, AddClientOutputDto } from "./add-client.dto";

export default class AddClientUseCase implements UseCaseInterface {
  constructor(private clientRepository: ClientGateway) {}

  async execute(input: AddClientInputDto): Promise<AddClientOutputDto> {
    const client = new ClientEntity({
      ...input,
      address: new Address({
        city: input.city,
        complement: input.complement,
        number: input.number,
        state: input.state,
        street: input.street,
        zipCode: input.zipCode,
      }),
      id: new Id(input.id),
    });

    await this.clientRepository.add(client);

    return {
      id: client.id.id,
      name: client.name,
      email: client.email,
      city: client.address.city,
      complement: client.address.complement,
      number: client.address.number,
      state: client.address.state,
      street: client.address.street,
      zipCode: client.address.zipCode,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
