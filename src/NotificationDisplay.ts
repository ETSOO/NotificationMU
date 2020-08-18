import React from 'react';
import {
    NotificationContainer,
    NotificationAlign
} from '@etsoo/notificationbase';

/**
 * Notification Display properties
 */
export interface NotificationDisplayProps {
    /**
     * Style class name
     */
    className?: string;

    /**
     * Create notification container
     * @param align Align
     * @param children Children
     */
    createContainer(
        align: NotificationAlign,
        children: React.ReactNode[]
    ): React.ReactNode;

    /**
     * Each notification style class name
     */
    itemClassName?: string;
}

/**
 * Notification display
 */
export function NotificationDisplay(props: NotificationDisplayProps) {
    // Destruct
    const { className, createContainer, itemClassName } = props;

    // User state to hold notification count
    const [count, updateCount] = React.useState(0);

    /**
     * Update notification callback
     * @param notifictionId Notification id
     * @param remove Is remove action
     */
    const updateNotification = (notifictionId: string, remove: boolean) => {
        updateCount(NotificationContainer.count);
    };

    // Render notifications
    const renderNotifications = () => {
        // Aligns collection
        const aligns: React.ReactNode[] = [];

        // Aligns
        for (const align in NotificationContainer.notifications) {
            // Notifications under the align
            const notifications = NotificationContainer.notifications[align];

            // UI collections
            const ui = notifications.map((notification) =>
                notification.render(itemClassName)
            );

            // Add to the collection
            aligns.push(createContainer(Number(align), ui));
        }

        // Return
        return aligns;
    };

    // Register current UI to the global container
    // Every update should register again under functional component
    NotificationContainer.register(updateNotification);

    // Layout ready
    React.useEffect(() => {
        return () => {
            // Dispose all notifications to avoid any timeout memory leak
            NotificationContainer.dispose();
        };
    }, []);

    // Return composition
    return React.createElement('div', { className }, renderNotifications());
}
