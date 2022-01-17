import express from 'express';
import schedule from 'node-schedule';

const { WebClient } = require('@slack/web-api');

const web = new WebClient(process.env.SLACK_BOT_TOKEN);

const router = express.Router();
const rule = new schedule.RecurrenceRule();
rule.tz = 'Asia/Seoul';

schedule.scheduleJob('*/10 * * * * *', async () => {
  const result = await web.chat.postMessage({
    text: '10초에 한번 메세지를 보냅니다.',
    channel: 'bot_test',
  });

  console.log(result);
});

export default router;
