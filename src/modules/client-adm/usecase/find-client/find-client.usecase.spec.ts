import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import { FindClientInputDto } from "./find-client.dto";
import FindClientUseCase from "./find-client.usecase";

const client = {
  id: new Id("1"),
  name: "Client 1",
  email: "x@x.com",
  address: new Address({
    city: "City 1",
    complement: "Complement 1",
    number: "Number 1",
    state: "State 1",
    street: "Street 1",
    zipCode: "Zip Code 1",
  }),
  createdAt: new Date(),
  updatedAt: new Date(),
};

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(client)),
  };
};
describe("Find client usecase Unit Tests", () => {
  it("should find a client", async () => {
    const clientRepository = MockRepository();
    const usecase = new FindClientUseCase(clientRepository);
    const input: FindClientInputDto = {
      id: "1",
    };

    const result = await usecase.execute(input);

    expect(clientRepository.find).toHaveBeenCalled();
    expect(result).toEqual(
      expect.objectContaining({
        email: client.email,
        name: client.name,
        city: client.address.city,
        complement: client.address.complement,
        number: client.address.number,
        state: client.address.state,
        street: client.address.street,
        zipCode: client.address.zipCode,
        id: client.id.id,
      })
    );
  });
});
