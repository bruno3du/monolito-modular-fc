import Address from "../../@shared/domain/value-object/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object";
import ClientEntity from "../domain/client.entity";
import ClientGateway from "../gateway/client.gateway";
import { ClientModel } from "./client.model";

export default class ClientRepository implements ClientGateway {
  async find(id: string): Promise<ClientEntity> {
    const client = await ClientModel.findOne({ where: { id } });

    return new ClientEntity({
      id: new Id(client.id),
      name: client.name,
      email: client.email,
      address: new Address({
        city: client.city,
        complement: client.complement,
        number: client.number,
        state: client.state,
        street: client.street,
        zipCode: client.zipCode,
      }),
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    });
  }
  async add(client: ClientEntity): Promise<void> {
    await ClientModel.create({
      id: client.id.id,
      name: client.name,
      email: client.email,
      street: client.address.street,
      number: client.address.number,
      complement: client.address.complement,
      city: client.address.city,
      state: client.address.state,
      zipCode: client.address.zipCode,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    });
  }
}
