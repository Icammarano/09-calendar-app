import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

import "@testing-library/jest-dom";
import { DeleteEventFab } from "../../../components/ui/DeleteEventFab";
import { eventStartDelete } from "../../../actions/events";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initState = {};
const store = mockStore(initState);
store.dispatch = jest.fn(); //con esto puedo obtener todo los datos del store

jest.mock("../../../actions/events", () => ({
    eventStartDelete: jest.fn(),
}));

const wrapper = mount(
    <Provider store={store}>
        <DeleteEventFab />
    </Provider>
);

describe("Pruebas en <DeleteEventFab />", () => {
    test("Debe mostrarse correctamente", () => {
        expect(wrapper).toMatchSnapshot();
    });

    test("Debe llamar el eventStartDelete al hacer click", async () => {
        wrapper.find("button").prop("onClick")();

        expect(eventStartDelete).toHaveBeenCalled();
    });
});
