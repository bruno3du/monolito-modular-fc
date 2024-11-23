import e from "express";
import { AddClientInputDto } from "./add-client.dto";
import AddClientUseCase from "./add-client.usecase";

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
  };
};

describe("Add Client UseCase Unit Tests", () => {
  it("should add a client", async () => {
    const clientRepository = MockRepository();
    const usecase = new AddClientUseCase(clientRepository);
    const input: AddClientInputDto = {
      name: "Client 1",
      email: "x@x.com",
      address: "Address 1",
    };
    await clientRepository.add(input);
    const result = await usecase.execute(input);

    expect(clientRepository.add).toHaveBeenCalled();
    expect(result).toEqual(
      expect.objectContaining({
        email: input.email,
        name: input.name,
        address: input.address,
      })
    );
  });
});
