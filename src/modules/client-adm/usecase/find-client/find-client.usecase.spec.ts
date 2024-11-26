import Id from "../../../@shared/domain/value-object/id.value-object";
import { FindClientInputDto } from "./find-client.dto";
import FindClientUseCase from "./find-client.usecase";

const client = {
  id: new Id("1"),
  name: "Client 1",
  email: "x@x.com",
  address: "Address 1",
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
        ...client,
        id: client.id.id,
      })
    );
  });
});
