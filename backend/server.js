const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors({
  origin: 'https://scaling-train-xqx9jvpgrwwfrq4-4200.app.github.dev',
  methods: ['GET', 'POST'],
}));

app.use(express.json());

app.get('/agent/stream', (req, res) => {
  console.log('SSE client connected'); 
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://scaling-train-xqx9jvpgrwwfrq4-4200.app.github.dev'
  );

  const steps = [
    'Step 1: Understanding input',
    'Step 2: Planning actions',
    'Step 3: Executing tools',
    'Step 4: Final response'
  ];

  let index = 0;

  const interval = setInterval(() => {
    if (index < steps.length) {
      res.write(`data: ${steps[index]}\n\n`);
      index++;
    } else {
      res.write(`data: DONE\n\n`);
      clearInterval(interval);
      res.end();
    }
  }, 800);
});


app.listen(PORT, () => {
  console.log(`Agent backend running on port ${PORT}`);
});
