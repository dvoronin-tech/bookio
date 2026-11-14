import {
    createStartHandler,
    defaultStreamHandler,
    createServerEntry,
} from '@tanstack/react-start/server';
import { paraglideMiddleware } from './paraglide/server.js';
import { paraglideMiddleware as uiParaglideMiddleware } from '@bookio/ui/server';
import { paraglideMiddleware as bookingFormUiParaglideMiddleware } from '@bookio/booking-form-ui/server';

const handler = createStartHandler(defaultStreamHandler);

export default createServerEntry({
    fetch(request) {
        return uiParaglideMiddleware(request, () =>
            bookingFormUiParaglideMiddleware(request, () =>
                paraglideMiddleware(request, () => handler(request)),
            ),
        );
    },
});
