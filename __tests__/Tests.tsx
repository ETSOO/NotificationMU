import React from 'react';
import renderer from 'react-test-renderer';
import { NotificationDisplay } from '../src/NotificationDisplay';
import { NotificationReact } from '../src/NotificationReact';
import {
    NotificationContainer,
    NotificationType,
    NotificationAlign
} from '@etsoo/notificationbase';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Class implementation for tests
class NotificationReactTest extends NotificationReact {
    /**
     * Render method
     * @param className Style class name
     */
    render(className?: string) {
        return (
            <div key={this.id} className={className}>
                {this.content}
            </div>
        );
    }
}

// Timer mock
// https://jestjs.io/docs/en/timer-mocks
jest.useFakeTimers();

// Test notification display component
const displayUI = (
    <NotificationDisplay
        createContainer={(align, children) => {
            return (
                <div
                    key={align}
                    className={NotificationAlign[align].toLowerCase()}
                >
                    {children}
                </div>
            );
        }}
        className="test"
        itemClassName="item"
    />
);

test('Tests for NotificationUI with react-test-renderer', () => {
    // Arrange
    // Render the UI in the document
    const ui = renderer.create(displayUI);

    // Notification object
    const notification = new NotificationReactTest(
        NotificationType.Loading,
        'Loading...'
    );
    notification.timespan = 3;

    const childrenBefore = ui.root.findAllByProps(
        { className: 'item' },
        { deep: true }
    );
    expect(childrenBefore.length).toBe(0);

    // Rerenderer test
    // https://reactjs.org/docs/test-utils.html#act
    renderer.act(() => {
        // Add the notification
        NotificationContainer.add(notification);
    });

    // setTimeout should be called 1 time
    expect(setTimeout).toBeCalled();

    // The child added
    const children = ui.root.findAllByProps(
        { className: 'item' },
        { deep: true }
    );
    expect(children.length).toBe(1);

    renderer.act(() => {
        // Fast forward
        // Remove the child
        jest.runOnlyPendingTimers();
    });

    const childrenNow = ui.root.findAllByProps(
        { className: 'item' },
        { deep: true }
    );

    expect(childrenNow.length).toBe(0);
});

test('Tests for NotificationUI with enzyme', () => {
    // Arrange

    // Setup adapter
    Enzyme.configure({ adapter: new Adapter() });

    // Render the UI in the document
    const ui = shallow(displayUI);

    // Align groups
    // Object.keys(Enum) will return string and number keys
    expect(ui.children().length).toBe(
        Object.keys(NotificationAlign).length / 2
    );

    expect(ui.children().children('.item').length).toBe(0);

    // Notification object
    const notification = new NotificationReactTest(
        NotificationType.Loading,
        'Loading...'
    );
    notification.timespan = 3;

    // Add the notification
    NotificationContainer.add(notification);

    ui.update();
    expect(ui.children().children('.item').length).toBe(1);
    expect(ui.children().children('.item').text()).toBe('Loading...');

    // Fast forward
    // Remove the child
    jest.runOnlyPendingTimers();

    ui.update();
    expect(ui.children().children('.item').length).toBe(0);
});

jest.clearAllTimers();
