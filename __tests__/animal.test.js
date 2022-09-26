const fs = require("fs");
const request = require("supertest");
const app = require("../src/app");
const animalsData = require("../src/data/animals.json");

describe("Cadastro de animais", () => {
  afterAll(() => {
    while (animalsData.length > 0) {
      animalsData.pop();
    }
    fs.writeFileSync("src/data/animals.json", JSON.stringify(animalsData));
  });

  it("deve cadastrar um aninal com sucesso", async () => {
    const res = await request(app).post("/animais?nome=Spike&especie=Cachorro&idade=3");
    expect(res.status).toBe(201);
  });

  it("deve falhar no cadastro pois idade é inválida", async () => {
    const res = await request(app).post("/animais?nome=Mimi&especie=Gato&idade=jovem");
    expect(res.status).toBe(400);
  });

  it("deve falhar no cadastro pois o nome não possui 2 caracteres", async () => {
    const res = await request(app).post("/animais?nome=J&especie=Hamster&idade=1");
    expect(res.status).toBe(400);
  });
});

describe("Lista de animais", () => {
  beforeAll(() => {
    animalsData.push(
      {
        nome: "Dog",
        especie: "Cachorro",
        idade: "4",
      },
      {
        nome: "Mimi",
        especie: "Gato",
        idade: "3",
      },
      {
        nome: "Mel",
        especie: "Hamster",
        idade: "1",
      }
    );
    fs.writeFileSync("src/data/animals.json", JSON.stringify(animalsData));
  });

  afterAll(() => {
    while (animalsData.length > 0) {
      animalsData.pop();
    }
    fs.writeFileSync("src/data/animals.json", JSON.stringify(animalsData));
  });

  it("deve retornar uma lista de 3 animais", async () => {
    const res = await request(app).get("/animais");
    expect(res.body.length).toBe(3);
    expect(res.status).toBe(200);
  });
});
