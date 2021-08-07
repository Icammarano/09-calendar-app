import { fetchConToken, fetchSinToken } from "../../helpers/fetch";

describe("Pruebas con", () => {
    let token = "";

    test("fetchSinToken debe funcionar", async () => {
        const resp = await fetchSinToken(
            "auth",
            { email: "ignacio@gmail.com", password: "123456" },
            "POST"
        );

        expect(resp instanceof Response).toBe(true);

        const body = await resp.json();
        expect(body.ok).toBe(true);

        token = body.token;
    });

    test("fetchConToken debe funcionar", async () => {
        localStorage.setItem("token", token);

        const resp = await fetchConToken(
            "events/610149b1441b571744e3ab97",
            {},
            "DELETE"
        );
        const body = await resp.json();
        expect(body.msg).toBe("Evento no existe por ese id");
    });
});
