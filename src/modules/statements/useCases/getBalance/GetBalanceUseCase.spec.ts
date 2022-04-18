import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get balance", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("Should be able to get balance of an user", async () => {
    const user = await createUserUseCase.execute({
      name: "Marcelo Marçal",
      email: "marcelo@gmail.com",
      password: "12345",
    });

    const result = await getBalanceUseCase.execute({ user_id: user.id! });

    expect(result).toHaveProperty("balance");
    expect(result).toHaveProperty("statement");
  });

  it("Should not be able to get balance of an nonexistent user", async () => {
    await expect(
      getBalanceUseCase.execute({
        user_id: "692392379132792317983721032",
      })
    ).rejects.toEqual(new GetBalanceError());
  });
});
