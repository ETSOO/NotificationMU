import React from 'react';
import { Box, Snackbar, makeStyles, Theme } from '@material-ui/core';
import { DataTypes } from '@etsoo/shared';
import {
    NotificationDisplay,
    NotificationDisplayProps,
    NotificationAlign
} from '@etsoo/notificationui';

// Origin constructor generics
interface origin {
    vertical: 'top' | 'bottom';
    horizontal: DataTypes.HAlign;
}

// Calculate origin from align property
function getOrigin(align: NotificationAlign): origin | undefined {
    if (align === NotificationAlign.TopLeft) {
        return {
            horizontal: 'left',
            vertical: 'top'
        };
    }

    if (align === NotificationAlign.TopCenter) {
        return {
            horizontal: 'center',
            vertical: 'top'
        };
    }

    if (align === NotificationAlign.TopRight) {
        return {
            horizontal: 'right',
            vertical: 'top'
        };
    }

    if (align === NotificationAlign.BottomLeft) {
        return {
            horizontal: 'left',
            vertical: 'bottom'
        };
    }

    if (align === NotificationAlign.BottomCenter) {
        return {
            horizontal: 'center',
            vertical: 'bottom'
        };
    }

    if (align === NotificationAlign.BottomRight) {
        return {
            horizontal: 'right',
            vertical: 'bottom'
        };
    }

    return undefined;
}

// Style
const useStyles = makeStyles<Theme, { gap: number }>((theme) => ({
    screenCenter: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    listBox: {
        '& >*:not(:first-child)': {
            marginTop: ({ gap }) => theme.spacing(gap)
        }
    }
}));

/**
 *
 */
export interface NotificationDisplayMUProps
    extends Omit<NotificationDisplayProps, 'createContainer'> {
    /**
     * Items' gap
     */
    gap?: number;
}

/**
 * Material-UI version of notification display
 * @param props Properties
 */
export function NotificationDisplayMU(props: NotificationDisplayMUProps) {
    // Destruct
    const { gap = 1, ...rests } = props;

    // Style
    const classes = useStyles({ gap });

    // Align group container creator
    const createContainer = (
        align: NotificationAlign,
        children: React.ReactNode[]
    ) => {
        // Each align group, class equal to something similar to 'align-topleft'
        let className = `align-${NotificationAlign[align].toLowerCase()}`;

        if (children.length === 0) {
            return <div key={align} className={className} />;
        }

        if (align === NotificationAlign.Unknown) {
            // div container for style control
            return (
                <div key={align} className={className}>
                    {children}
                </div>
            );
        }

        if (align === NotificationAlign.Center)
            className += ' ' + classes.screenCenter;

        // Use SnackBar for layout
        return (
            <Snackbar
                anchorOrigin={getOrigin(align)}
                className={className}
                key={align}
                open
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    flexWrap="nowrap"
                    className={classes.listBox}
                >
                    {children}
                </Box>
            </Snackbar>
        );
    };

    return <NotificationDisplay createContainer={createContainer} {...rests} />;
}
