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

describe('Tests for NotificationMU', () => {
    // Arrange
    const mount = createMount();

    // Clearup when done
    afterAll(() => {
        mount.cleanUp();
    });

    // Wrap
    const wrapper = mount(displayUI);

    // Container
    const container = wrapper.find('div.container').first();

    it('Align groups match', () => {
        // Object.keys(Enum) will return string and number keys
        expect(container.children().length).toBe(
            Object.keys(NotificationAlign).length / 2
        );

        // Test one align group
        expect(container.find('div.align-unknown').length).toBe(1);
    });

    it('Add new notification', () => {
        // Notification object
        const notification = new NotificationMU(
            NotificationType.Loading,
            'Loading...'
        );
        notification.timespan = 3;

        // Unknown align group
        const unknownGroup = container.find('div.align-unknown').first();

        // https://reactjs.org/docs/test-utils.html#act
        act(() => {
            // Add the notification
            NotificationContainer.add(notification);
        });

        // Assert
        expect(unknownGroup.text()).toBe('Loading...');

        act(() => {
            // Fast forward
            // Remove the child
            jest.runOnlyPendingTimers();
        });

        // Assert
        expect(unknownGroup.text()).toBe('');
    });
});

jest.clearAllTimers();
