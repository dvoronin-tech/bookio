import {
    createStartHandler,
    defaultStreamHandler,
    createServerEntry,
} from '@tanstack/react-start/server';
import { paraglideMiddleware } from './paraglide/server.js';

const handler = createStartHandler(defaultStreamHandler);

export default createServerEntry({
    fetch(request) {
        return paraglideMiddleware(request, () => handler(request));
    },
});
