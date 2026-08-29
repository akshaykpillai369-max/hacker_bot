const axios = require("axios");


require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/hacker_bot_ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();

app.command("/hacker_bot-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/hacker_bot_ping - Check bot latency
/hacker_bot-fact - Get a live vulnerability update
/hacker_bot-catfact - Get a cat fact
/hacker_bot-joke - Get a joke`
  });
});

app.command("/hacker_bot-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});


app.command("/hack_bot-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text:
`${response.data.setup}

${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});

app.command("/hacker_bot-fact", async ({ ack, respond }) => {
  await ack()

  try {
    const res = await axios.get("https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json", {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
    })

    const list = res.data.vulnerabilities

    const item = list[Math.floor(Math.random() * list.length)]


    await respond({


      text: `Security Fact\n CVE: ${item.cveID} \n Name: ${item.vulnerabilityName} \n Summary: ${item.shortDescription}`


    })

  } catch (e) {

    await respond({ text: "Could not fetch vulnerability data right now." });
  }
})
