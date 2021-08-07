import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

import "@testing-library/jest-dom";

import { CalendarScreen } from "../../../components/calendar/CalendarScreen";
import { types } from "../../../types/types";
import { eventSetActive } from "../../../actions/events";
import { act } from "@testing-library/react";

jest.mock("../../../actions/events", () => ({
    eventSetActive: jest.fn(),
    eventStartLoading: jest.fn(),
}));

Storage.prototype.setItem = jest.fn();

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initState = {
    calendar: {
        events: [],
    },
    auth: {
        uid: "11234",
        name: "Ignacio",
    },
    ui: {
        openModal: false,
    },
};

const store = mockStore(initState);
store.dispatch = jest.fn(); //con esto puedo obtener todo los datos del store

const wrapper = mount(
    <Provider store={store}>
        <CalendarScreen />
    </Provider>
);

describe("Pruebas en <CalendarScreen />", () => {
    test("Debe mostrarse correctamente", () => {
        expect(wrapper).toMatchSnapshot();
    });

    test("Pruebas con las interacciones del calendario", () => {
        const calendar = wrapper.find("Calendar");

        const calendarMessages = calendar.prop("messages");
        expect(calendarMessages).toEqual(calendarMessages);

        calendar.prop("onDoubleClickEvent")();

        expect(store.dispatch).toHaveBeenCalledWith({
            type: types.uiOpenModal,
        });

        calendar.prop("onSelectEvent")({ start: "Hola" });

        expect(eventSetActive).toHaveBeenCalledWith({ start: "Hola" });

        act(() => {
            calendar.prop("onView")("week");
            expect(localStorage.setItem).toHaveBeenCalledWith(
                "lastView",
                "week"
            );
        });
    });
});
