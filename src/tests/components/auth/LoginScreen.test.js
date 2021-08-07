import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

import "@testing-library/jest-dom";
import { LoginScreen } from "../../../components/auth/LoginScreen";
import { startLogin, startRegister } from "../../../actions/auth";
import Swal from "sweetalert2";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initState = {};
const store = mockStore(initState);
store.dispatch = jest.fn(); //con esto puedo obtener todo los datos del store

jest.mock("../../../actions/auth", () => ({
    startLogin: jest.fn(),
    startRegister: jest.fn(),
}));

jest.mock("sweetalert2", () => ({
    fire: jest.fn(),
}));

const wrapper = mount(
    <Provider store={store}>
        <LoginScreen />
    </Provider>
);

describe("Pruebas con <LoginScreen />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Debe mostrarse correctamente", () => {
        expect(wrapper).toMatchSnapshot();
    });

    test("debe llamar el dispatch del login", () => {
        wrapper.find('input[name="lEmail"]').simulate("change", {
            target: {
                name: "lEmail",
                value: "pepe@ppp.com",
            },
        });

        wrapper.find('input[name="lPassword"]').simulate("change", {
            target: {
                name: "lPassword",
                value: "123456",
            },
        });

        wrapper.find("form").at(0).prop("onSubmit")({
            preventDefault() {},
        });

        expect(startLogin).toHaveBeenCalledWith("pepe@ppp.com", "123456");
    });

    test("No hay registro si las contraseñas son diferentes", () => {
        wrapper.find('input[name="rEmail"]').simulate("change", {
            target: {
                name: "rEmail",
                value: "email@ppp.com",
            },
        });

        wrapper.find('input[name="rName"]').simulate("change", {
            target: {
                name: "rName",
                value: "Robertito",
            },
        });

        wrapper.find('input[name="rPassword1"]').simulate("change", {
            target: {
                name: "rPassword1",
                value: "123456",
            },
        });

        wrapper.find('input[name="rPassword2"]').simulate("change", {
            target: {
                name: "rPassword2",
                value: "1234567",
            },
        });

        wrapper.find("form").at(1).prop("onSubmit")({
            preventDefault() {},
        });

        expect(startRegister).not.toHaveBeenCalled();

        expect(Swal.fire).toHaveBeenCalledWith(
            "Error",
            "Las contraseñas no coinciden",
            "error"
        );
    });

    test("Registro con contraseñas iguales", () => {
        wrapper.find('input[name="rEmail"]').simulate("change", {
            target: {
                name: "rEmail",
                value: "email@ppp.com",
            },
        });

        wrapper.find('input[name="rName"]').simulate("change", {
            target: {
                name: "rName",
                value: "Robertito",
            },
        });

        wrapper.find('input[name="rPassword1"]').simulate("change", {
            target: {
                name: "rPassword1",
                value: "123456",
            },
        });

        wrapper.find('input[name="rPassword2"]').simulate("change", {
            target: {
                name: "rPassword2",
                value: "123456",
            },
        });

        wrapper.find("form").at(1).prop("onSubmit")({
            preventDefault() {},
        });

        expect(Swal.fire).not.toHaveBeenCalled();
        expect(startRegister).toHaveBeenCalledWith(
            "email@ppp.com",
            "123456",
            "Robertito"
        );
    });
});
