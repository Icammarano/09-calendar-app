import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import Swal from "sweetalert2";

import "@testing-library/jest-dom";

import { startChecking, startLogin, startRegister } from "../../actions/auth";
import { types } from "../../types/types";
import * as fetchModule from "../../helpers/fetch";

jest.mock("sweetalert2", () => ({
    fire: jest.fn(),
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initState = {};
let store = mockStore(initState);

Storage.prototype.setItem = jest.fn();

describe("Pruebas en las acciones Auth", () => {
    //reinicializa el store en cada prueba
    beforeEach(() => {
        store = mockStore(initState);
        jest.clearAllMocks();
    });

    test("startLogin correcto", async () => {
        await store.dispatch(startLogin("ignacio@gmail.com", "123456"));

        const actions = store.getActions();

        expect(actions[0]).toEqual({
            type: types.authLogin,
            payload: {
                uid: expect.any(String),
                name: expect.any(String),
            },
        });

        expect(localStorage.setItem).toHaveBeenCalledWith(
            "token",
            expect.any(String)
        );
        expect(localStorage.setItem).toHaveBeenCalledWith(
            "token-init-date",
            expect.any(Number)
        );

        // console.log(localStorage.setItem.mock.calls);
        // console.log(localStorage.setItem.mock.calls[0][1]);

        // [
        //     'token',
        //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MGZlZmNiNTNhNzM2MzQzNjBjZjhmYzMiLCJuYW1lIjoiSWduYWNpbyIsImlhdCI6MTYyODAyNzk1MywiZXhwIjoxNjI4MDM1MTUzfQ.IYr_cDNyqgKM-wAk76vg7Jy9OY2n_Tj-WBOz7C7pwUk'
        //   ],
        //   [ 'token-init-date', 1628027953184 ]
        // ]
    });

    test("startLogin incorrecto", async () => {
        await store.dispatch(startLogin("ignacio@gmail.com", "123123123456"));
        let actions = store.getActions();

        expect(actions).toEqual([]);
        expect(Swal.fire).toHaveBeenCalledWith(
            "Error",
            "Password incorrecto",
            "error"
        );

        await store.dispatch(startLogin("ignacio@gmail2.com", "123456"));
        actions = store.getActions();

        expect(Swal.fire).toHaveBeenCalledWith(
            "Error",
            "El usuario no existe con ese email",
            "error"
        );
    });

    test("startRegister correcto", async () => {
        //generando mock de fetchsintoken, se lo pone entre parentesis porque se retorna
        fetchModule.fetchSinToken = jest.fn(() => ({
            json() {
                return {
                    ok: true,
                    uid: "1234",
                    name: "roberto",
                    token: "ABCE22121",
                };
            },
        }));

        await store.dispatch(startRegister("test@test.com", "123456", "TEST"));

        const actions = store.getActions();

        expect(actions[0]).toEqual({
            type: types.authLogin,
            payload: {
                uid: "1234",
                name: "roberto",
            },
        });

        expect(localStorage.setItem).toHaveBeenCalledWith("token", "ABCE22121");
        expect(localStorage.setItem).toHaveBeenCalledWith(
            "token-init-date",
            expect.any(Number)
        );
    });

    test("startChecking correcto", async () => {
        fetchModule.fetchConToken = jest.fn(() => ({
            json() {
                return {
                    ok: true,
                    uid: "1234",
                    name: "roberto",
                    token: "ABCE22121",
                };
            },
        }));

        await store.dispatch(startChecking());

        const actions = store.getActions();

        expect(actions[0]).toEqual({
            type: types.authLogin,
            payload: {
                uid: "1234",
                name: "roberto",
            },
        });

        expect(localStorage.setItem).toHaveBeenCalledWith("token", "ABCE22121");
    });
});
