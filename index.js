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
/hacker_bot-vuln - Get a live vulnerability update
/hacker_bot-catfact - Get a cat fact
/hacker_bot-joke - Get a joke
/hacker_bot-passcheck- gives the strength of the password`
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


app.command("/hacker_bot-joke", async ({ ack, respond }) => {
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

app.command("/hacker_bot-vuln", async ({ ack, respond }) => {
  await ack()

  try {


    const res = await axios.get("https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=10")

    const list = res.data.vulnerabilities

    const item = list[Math.floor(Math.random() * list.length)].cve


    const id = item.id

    const desc = item.descriptions.find(d => d.lang === "en")?.value || "No description"


    await respond({
      text: `Security Fact \n CVE: ${id}\n Summary:  ${desc}`


    })

  } catch (err) {

    await respond({ text: "Could not fetch vulnerability data right now." })
  }
})

app.command("/hacker_bot-passcheck", async({command, ack, respond})=> {

  await ack()

  const pass = command.text.trim()


  if(!pass){

    await respond({

      text: "Use like this : /hacker_bot-passcheck your-password",
      response_type: "ephemeral"

    })
    return
  }

  let strength = 'Weak'
  if(pass.length >= 12){

    strength = "Strong"
  }

  else if (pass.length >=8) {

    strength = "Moderate"
  }

  await respond({

    text : `Password check results \n Length : ${pass.length} \n Strength of the pass: ${strength}`,
    response_type: "ephemeral"


  })
})