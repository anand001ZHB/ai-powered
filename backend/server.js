const express = require('express');
const cors = require('cors');
const PromptFactory = require('./agent/PromptFactory');

const app = express();
const PORT = 3001;
const runs = new Map();

app.use(cors({
  origin: 'https://scaling-train-xqx9jvpgrwwfrq4-4200.app.github.dev',
  methods: ['GET', 'POST'],
}));

app.use(express.json());

app.post('/agent/run', (req, res) => {
  const { mode, feature, input } = req.body;

  const runId = Date.now().toString();

  runs.set(runId, { mode, feature, input });

  console.log('Agent run started:', runId, mode, feature);

  res.json({ runId });
});


// app.get('/agent/stream', (req, res) => {
//   res.setHeader('Content-Type', 'text/event-stream');
//   res.setHeader('Cache-Control', 'no-cache');
//   res.setHeader('Connection', 'keep-alive');

//   res.setHeader(
//     'Access-Control-Allow-Origin',
//     'https://scaling-train-xqx9jvpgrwwfrq4-4200.app.github.dev'
//   );

//   const steps = [
//     'Step 1: Understanding input',
//     'Step 2: Planning actions',
//     'Step 3: Executing tools',
//     'Step 4: Final response'
//   ];

//   let index = 0;

//   const interval = setInterval(() => {
//     if (index < steps.length) {
//       res.write(`data: ${steps[index]}\n\n`);
//       index++;
//     } else {
//       res.write(`data: DONE\n\n`);
//       clearInterval(interval);
//       res.end();
//     }
//   }, 800);
// });

app.get('/agent/stream', (req, res) => {
  const { runId } = req.query;
  const run = runs.get(runId);

  if (!run) {
    return res.status(404).end();
  }

  console.log('SSE stream started for run:', runId);

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://scaling-train-xqx9jvpgrwwfrq4-4200.app.github.dev'
  );

  const { mode, feature, input } = run;
  const promptPlan = PromptFactory.create({
    mode,
    feature,
    input
  });


  // GENERATIVE FLOW
  if (promptPlan.type === 'generative') {
    res.write(`data: ${promptPlan.steps[0]}\n\n`);
    res.write(`data: DONE\n\n`);
    res.end();
    return;
  }


  // AGENTIC FLOW
  let index = 0;
  const interval = setInterval(() => {
    if (index < promptPlan.steps.length) {
      res.write(`data: ${promptPlan.steps[index]}\n\n`);
      index++;
    } else {
      res.write(`data: DONE\n\n`);
      clearInterval(interval);
      res.end();
    }
  }, 800);

  req.on('close', () => {
    clearInterval(interval);
    console.log('SSE client disconnected for run:', runId);
  });
});


app.listen(PORT, () => {
  console.log(`Agent backend running on port ${PORT}`);
});
