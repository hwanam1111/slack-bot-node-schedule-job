import express from 'express';

import slackBot from './files/slackBot';

const app = express();

app.use(slackBot); 

export default app;
