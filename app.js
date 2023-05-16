import 'dotenv/config';

import express from 'express';
import cookieParser from 'cookie-parser';

// eslint-disable-next-line no-unused-vars
import db from './utils/db.js';
import { logErrors, errorHandler, notFoundHandler } from './middleware/errorHandler.js';

import usersRoute from './routes/users.js';
import channelsRoute from './routes/channels.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use('/api/users', usersRoute);
app.use('/api/channels', channelsRoute);

app.use(notFoundHandler);
app.use(logErrors);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
