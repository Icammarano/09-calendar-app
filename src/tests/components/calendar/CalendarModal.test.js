import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

import "@testing-library/jest-dom";
import { CalendarModal } from "../../../components/calendar/CalendarModal";
import moment from "moment";
import {
    eventClearActiveEvent,
    eventStartUpdate,
    eventStartAddNew,
} from "../../../actions/events";
import { act } from "@testing-library/react";
import Swal from "sweetalert2";

jest.mock("sweetalert2", () => ({
    fire: jest.fn(),
}));

jest.mock("../../../actions/events", () => ({
    eventStartUpdate: jest.fn(),
    eventClearActiveEvent: jest.fn(),
    eventStartAddNew: jest.fn(),
}));
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const now = moment().minutes(0).seconds(0).add(1, "hours"); // le pongo que arranque con minutos en 0 y segundos en 0, y aparte que añada 1 hora
const nowPlus1 = now.clone().add(1, "hours"); // le pongo que arranque con minutos en 0 y segundos en 0, y aparte que añada 1 hora

const initState = {
    calendar: {
        events: [],
        activeEvent: {
            title: "Hola mundo",
            notes: "Alguna nota",
            start: now.toDate(),
            end: nowPlus1.toDate(),
        },
    },
    auth: {
        uid: "11234",
        name: "Ignacio",
    },
    ui: {
        modalOpen: true,
    },
};

const store = mockStore(initState);
store.dispatch = jest.fn(); //con esto puedo obtener todo los datos del store

const wrapper = mount(
    <Provider store={store}>
        <CalendarModal />
    </Provider>
);

describe("Pruebas en <CalendarModal />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Debe mostrar el modal", () => {
        // expect(wrapper.find(".modal").exists()).toBe(true);
        expect(wrapper.find("Modal").prop("isOpen")).toBe(true);
    });

    test("debe llamar la acción de actualizar y cerrar modal", () => {
        wrapper.find("form").simulate("submit", {
            preventDefault() {},
        });

        expect(eventStartUpdate).toHaveBeenCalledWith(
            initState.calendar.activeEvent
        );

        expect(eventClearActiveEvent).toHaveBeenCalled();
    });

    test("debe mostrar error si falta el título", () => {
        wrapper.find("form").simulate("submit", {
            preventDefault() {},
        });

        expect(wrapper.find('input[name="title"]').hasClass("is-invalid")).toBe(
            true
        );
    });

    test("debe crear un nuevo evento", () => {
        const initState = {
            calendar: {
                events: [],
                activeEvent: null,
            },
            auth: {
                uid: "11234",
                name: "Ignacio",
            },
            ui: {
                modalOpen: true,
            },
        };

        const store = mockStore(initState);
        store.dispatch = jest.fn(); //con esto puedo obtener todo los datos del store

        const wrapper = mount(
            <Provider store={store}>
                <CalendarModal />
            </Provider>
        );

        wrapper.find('input[name="title"]').simulate("change", {
            target: {
                name: "title",
                value: "Hola pruebas",
            },
        });

        wrapper.find("form").simulate("submit", {
            preventDefault() {},
        });

        expect(eventStartAddNew).toHaveBeenCalledWith({
            end: expect.anything(),
            start: expect.anything(),
            title: "Hola pruebas",
            notes: "",
        });

        expect(eventClearActiveEvent).toHaveBeenCalled();
    });

    test("debe validar las fechas", () => {
        wrapper.find('input[name="title"]').simulate("change", {
            target: {
                name: "title",
                value: "Hola pruebas",
            },
        });

        const hoy = new Date();

        //Se lo encierra en un act, debido a que lo que luego se ejecuta está modificando el estado de react, hay un setState
        act(() => {
            wrapper.find("DateTimePicker").at(1).prop("onChange")(hoy);
        });

        wrapper.find("form").simulate("submit", {
            preventDefault() {},
        });

        expect(Swal.fire).toHaveBeenCalledWith(
            "Error",
            "La Fecha Fin debe ser mayor a la Fecha Inicio",
            "error"
        );
    });
});
