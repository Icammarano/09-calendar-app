import { authReducer } from "../../reducers/authReducer";
import { types } from "../../types/types";

const initialState = {
    checking: true,
};

describe("Pruebas con authReducer", () => {
    //stado inicial y autenticacion de usuario
    test("debe retornar el estado por defecto", () => {
        const state = authReducer(initialState, {});

        expect(state).toEqual(initialState);
    });

    test("debe autenticar el usuario", () => {
        const action = {
            type: types.authLogin,
            payload: {
                uid: "1234",
                name: "Ignacio",
            },
        };

        const state = authReducer(initialState, action);

        expect(state).toEqual({
            checking: false,
            uid: "1234",
            name: "Ignacio",
        });
    });
});
