const http = require("node:http");

function jsonBody(obj) {
  return JSON.stringify(obj);
}

function makeServer(handlers) {
  return http.createServer((req, res) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const handler = handlers[req.url];
      if (!handler) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(jsonBody({ error: "Not found" }));
        return;
      }
      const parsed = body ? JSON.parse(body) : {};
      const result = handler(parsed);
      res.writeHead(result.status, { "Content-Type": "application/json" });
      res.end(jsonBody(result.body));
    });
  });
}

describe("color API integration", () => {
  let server;
  let baseUrl;

  beforeAll((done) => {
    const users = [{ login: "alice", password: "password1", id: 1, firstName: "Alice", lastName: "Smith" }];
    const colors = { 1: ["Red", "Green", "Blue"] };

    server = makeServer({
      "/Login.php": (input) => {
        const user = users.find(
          (u) => u.login === input.login && u.password === input.password
        );
        if (user) {
          return { status: 200, body: { id: user.id, firstName: user.firstName, lastName: user.lastName, error: "" } };
        }
        return { status: 200, body: { id: 0, firstName: "", lastName: "", error: "No Records Found" } };
      },
      "/SearchColors.php": (input) => {
        if (!input.userId || !colors[input.userId]) {
          return { status: 200, body: { results: [], error: "No Records Found" } };
        }
        const match = colors[input.userId].filter((c) =>
          c.toLowerCase().includes(String(input.search).toLowerCase())
        );
        if (match.length === 0) {
          return { status: 200, body: { results: [], error: "No Records Found" } };
        }
        return { status: 200, body: { results: match, error: "" } };
      },
      "/AddColor.php": (input) => {
        if (!input.color || !input.userId) {
          return { status: 200, body: { success: false, error: "Missing fields" } };
        }
        if (!colors[input.userId]) {
          colors[input.userId] = [];
        }
        colors[input.userId].push(input.color);
        return { status: 200, body: { success: true } };
      },
    });

    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = "http://localhost:" + port;
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  async function post(path, payload) {
    const response = await fetch(baseUrl + path, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: jsonBody(payload),
    });
    const contentType = response.headers.get("content-type") || "";
    const body = contentType.includes("application/json") ? await response.json() : await response.text();
    return { status: response.status, body, headers: response.headers };
  }

  describe("POST /Login.php", () => {
    it("returns 200 and a user object with id, firstName, lastName, and error fields", async () => {
      const { status, body } = await post("/Login.php", { login: "alice", password: "password1" });
      expect(status).toBe(200);
      expect(body).toHaveProperty("id", 1);
      expect(body).toHaveProperty("firstName", "Alice");
      expect(body).toHaveProperty("lastName", "Smith");
      expect(body).toHaveProperty("error", "");
    });

    it("returns an error object with id 0 for invalid credentials", async () => {
      const { status, body } = await post("/Login.php", { login: "alice", password: "wrong" });
      expect(status).toBe(200);
      expect(body).toHaveProperty("id", 0);
      expect(body).toHaveProperty("error", "No Records Found");
    });
  });

  describe("POST /SearchColors.php", () => {
    it("returns a results array and an error string", async () => {
      const { status, body } = await post("/SearchColors.php", { search: "e", userId: 1 });
      expect(status).toBe(200);
      expect(Array.isArray(body.results)).toBe(true);
      expect(typeof body.error).toBe("string");
      expect(body.results).toContain("Red");
      expect(body.results).toContain("Blue");
    });

    it("returns an empty results array with an error when nothing matches", async () => {
      const { status, body } = await post("/SearchColors.php", { search: "zzz", userId: 1 });
      expect(status).toBe(200);
      expect(body.results).toEqual([]);
      expect(body.error).toBe("No Records Found");
    });
  });

  describe("POST /AddColor.php", () => {
    it("returns a success object when adding a color", async () => {
      const { status, body } = await post("/AddColor.php", { color: "Purple", userId: 1 });
      expect(status).toBe(200);
      expect(body).toHaveProperty("success", true);
    });

    it("returns an error when required fields are missing", async () => {
      const { status, body } = await post("/AddColor.php", { color: "", userId: 1 });
      expect(status).toBe(200);
      expect(body).toHaveProperty("success", false);
      expect(body).toHaveProperty("error", "Missing fields");
    });
  });
});
