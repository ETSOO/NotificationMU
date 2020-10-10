import React from 'react';
import {
    Backdrop,
    Box,
    CircularProgress,
    makeStyles,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Snackbar,
    Paper,
    PaperProps,
    TextField,
    IconButton,
    Fade
} from '@material-ui/core';
import { Alert, AlertTitle, Color } from '@material-ui/lab';
import { Close, Error, Info, Help } from '@material-ui/icons';
import Draggable from 'react-draggable';
import { DataTypes, DomUtils } from '@etsoo/shared';
import { NotificationReact, NotificationType } from '@etsoo/notificationui';

// Style
const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.modal + 1,
        color: '#fff'
    },
    iconTitle: {
        cursor: 'move',
        minWidth: '360px',
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
        '& h2': {
            paddingLeft: theme.spacing(1)
        }
    },
    loadingBox: {
        '& >*:not(:first-child)': {
            marginTop: theme.spacing(1)
        }
    }
}));

// Functional component properties
interface NotificationMUCreatorProps {
    className?: string;
    host: NotificationMU;
    labels?: DataTypes.ReadonlyStringDictionary;
}

// Draggable Paper component for Dialog
function PaperComponent(props: PaperProps) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
}

// Functional component for creation
function NotificationMUCreator(props: NotificationMUCreatorProps) {
    // Style
    const classes = useStyles();

    // Destruct
    const { className, labels = {}, host } = props;
    const { content, id, inputProps = {}, onReturn, open, type } = host;
    let { title } = host;

    // Loading bar
    if (type === NotificationType.Loading) {
        return (
            <Backdrop
                className={DomUtils.mergeClasses(className, classes.backdrop)}
                open={open}
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    flexWrap="nowrap"
                    alignItems="center"
                    className={classes.loadingBox}
                >
                    <CircularProgress color="primary" />
                    <Box width="75%" maxWidth={640}>
                        {content}
                    </Box>
                </Box>
            </Backdrop>
        );
    }

    // On dismiss
    const dismiss = () => {
        host.dismiss();
    };

    // On return
    // Dismiss first, then run callback
    const returnValue = (value: any) => {
        dismiss();
        if (onReturn) onReturn(value);
    };

    const inputRef = React.useRef<HTMLInputElement>();
    const returnInputValue = () => {
        const input = inputRef.current;
        if (input) {
            if (input.value) {
                returnValue(input.value);
            } else {
                input.focus();
            }
        }
    };

    if (type === NotificationType.Confirm) {
        if (!title) {
            title = labels.confirm || 'Confirm';
        }

        return (
            <Dialog
                open={open}
                PaperComponent={PaperComponent}
                className={className}
            >
                <DialogTitle
                    disableTypography
                    className={classes.iconTitle}
                    id="draggable-dialog-title"
                >
                    <Help color="action" />
                    <h2>{title}</h2>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>{content}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="secondary"
                        onClick={() => returnValue(false)}
                    >
                        {labels.no || 'No'}
                    </Button>
                    <Button
                        color="primary"
                        onClick={() => returnValue(true)}
                        autoFocus
                    >
                        {labels.yes || 'Yes'}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    if (type === NotificationType.Prompt) {
        if (!title) {
            title = labels.input || 'Input';
        }

        return (
            <Dialog
                open={open}
                PaperComponent={PaperComponent}
                className={className}
            >
                <DialogTitle
                    disableTypography
                    className={classes.iconTitle}
                    id="draggable-dialog-title"
                >
                    <Info color="primary" />
                    <h2>{title}</h2>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>{content}</DialogContentText>
                    <TextField
                        autoFocus
                        fullWidth
                        inputRef={inputRef}
                        {...inputProps}
                    />
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={dismiss}>
                        {labels.cancel || 'Cancel'}
                    </Button>
                    <Button color="primary" onClick={() => returnInputValue()}>
                        {labels.confirm || 'Confirm'}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    if (type === NotificationType.Error) {
        if (!title) {
            title = labels.error || 'Error';
        }

        return (
            <Dialog
                open={open}
                PaperComponent={PaperComponent}
                className={className}
            >
                <DialogTitle
                    disableTypography
                    className={classes.iconTitle}
                    id="draggable-dialog-title"
                >
                    <Error color="error" />
                    <h2>{title}</h2>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>{content}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={() => returnValue(undefined)}
                        autoFocus
                    >
                        {inputProps.buttonLabel || labels.ok || 'OK'}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    // Other cases, use Snakebar or toast and alert
    if (type === NotificationType.Default) {
        return (
            <Snackbar
                key={id}
                open={open}
                message={content}
                className={className}
                TransitionComponent={Fade}
                action={
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={() => returnValue(undefined)}
                    >
                        <Close fontSize="small" />
                    </IconButton>
                }
            ></Snackbar>
        );
    }

    if (!open) {
        return <></>;
    }

    const severity =
        type === NotificationType.Danger
            ? 'error'
            : (NotificationType[type].toLowerCase() as Color);

    return (
        <Fade in={true}>
            <Alert
                key={id}
                severity={severity}
                variant="filled"
                onClose={() => returnValue(undefined)}
            >
                {title && <AlertTitle>{title}</AlertTitle>}
                {content}
            </Alert>
        </Fade>
    );
}

/**
 * Material-UI version of notification
 */
export class NotificationMU extends NotificationReact {
    /**
     * Render method
     * @param className Style class name
     * @param labels UI labels
     */
    render(className?: string, labels?: DataTypes.ReadonlyStringDictionary) {
        return (
            <NotificationMUCreator
                className={className}
                host={this}
                labels={labels}
                key={this.id}
            />
        );
    }
}
