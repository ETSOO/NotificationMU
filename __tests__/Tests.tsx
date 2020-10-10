import React from 'react';
import { NotificationDisplayMU } from '../src/NotificationDisplayMU';
import { NotificationMU } from '../src/NotificationMU';
import {
    NotificationContainer,
    NotificationType,
    NotificationAlign
} from '@etsoo/notificationbase';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createMount } from '@material-ui/core/test-utils';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';
import { act } from 'react-dom/test-utils';

// Timer mock
// https://jestjs.io/docs/en/timer-mocks
jest.useFakeTimers();

// Labels
const labels = {
    confirm: 'Confirm',
    error: 'Error',
    no: 'No',
    ok: 'OK',
    yes: 'Yes'
};

// Test notification display component
// Theme is necessary for rendering
const theme = createMuiTheme({});
const displayUI = (
    <ThemeProvider theme={theme}>
        <NotificationDisplayMU
            className="container"
            itemClassName="item"
            labels={labels}
        />
    </ThemeProvider>
);

// Setup adapter
Enzyme.configure({ adapter: new Adapter() });

// For fake timers
jest.useFakeTimers();

describe('Tests for NotificationMU', () => {
    // Arrange
    const mount = createMount({ strict: false });

    // Clearup when done
    afterAll(() => {
        mount.cleanUp();
    });

    // Wrap
    const wrapper = mount(displayUI);

    // Container
    const container = wrapper.find('div.container').first();

    // Modal container
    const modalContainer = container.find('div.align-unknown').first();

    it('Align groups match', () => {
        // Object.keys(Enum) will return string and number keys
        expect(container.children().length).toBe(
            Object.keys(NotificationAlign).length / 2
        );

        // Test one align group
        expect(modalContainer).not.toBeUndefined();
    });

    it('Add new notification', (done) => {
        // Notification loading
        const notificationLoading = new NotificationMU(
            NotificationType.Loading,
            'Loading...'
        );

        // https://reactjs.org/docs/test-utils.html#act
        act(() => {
            // Add the notification
            NotificationContainer.add(notificationLoading);

            // Fast forward
            jest.runOnlyPendingTimers();
        });

        act(() => {
            // Dismiss loading notification
            notificationLoading.dismiss();

            // Fast forward
            jest.runOnlyPendingTimers();
        });

        // Confirm
        const notification = new NotificationMU(
            NotificationType.Error,
            'Error found'
        );
        notification.onReturn = (value) => {
            expect(value).toBeUndefined();

            // Fast forward
            jest.runOnlyPendingTimers();

            done();
        };

        // https://reactjs.org/docs/test-utils.html#act
        act(() => {
            // Add error notification
            NotificationContainer.add(notification);

            // Fast forward
            jest.runOnlyPendingTimers();
        });

        // 'OK' button
        const buttonOK = document.getElementsByTagName('button')[0];
        expect(buttonOK).not.toBeUndefined();

        // Click it
        buttonOK.click();
    });
});

jest.clearAllTimers();
