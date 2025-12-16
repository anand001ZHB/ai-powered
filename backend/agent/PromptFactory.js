// backend/agent/PromptFactory.js

const SYSTEM_PROMPT = `
You are an expert frontend engineer with deep Angular knowledge.
You explain concepts clearly, accurately, and step-by-step when needed.
You avoid speculation and clearly state assumptions.
`.trim();

class PromptFactory {
  static create({ mode, feature, input }) {
    if (!mode || !feature) {
      throw new Error('Invalid prompt input');
    }

    if (mode === 'generative') {
      return this.buildGenerativePrompt(feature, input);
    }

    if (mode === 'agentic') {
      return this.buildAgenticPrompt(feature, input);
    }

    throw new Error(`Unsupported mode: ${mode}`);
  }

  // -------------------------
  // GENERATIVE PROMPTS
  // -------------------------
  static buildGenerativePrompt(feature, input) {
    let taskPrompt = '';

    switch (feature) {
      case 'explain':
        taskPrompt = `
Explain the following Angular / TypeScript code clearly and concisely.
Focus on:
- What the code does
- Why it is written this way
- Important Angular concepts involved

Code:
${input}
        `;
        break;

      case 'review':
        taskPrompt = `
Review the following code.
Highlight:
- Code quality issues
- Angular best practices
- Possible improvements

Code:
${input}
        `;
        break;

      case 'debug':
        taskPrompt = `
Analyze the following code for bugs or runtime issues.
Explain:
- What could go wrong
- Why
- How to fix it

Code:
${input}
        `;
        break;

      default:
        throw new Error(`Unsupported feature: ${feature}`);
    }

    return {
      type: 'generative',
      systemPrompt: SYSTEM_PROMPT,
      steps: [taskPrompt.trim()]
    };
  }

  // -------------------------
  // AGENTIC PROMPTS
  // -------------------------
  static buildAgenticPrompt(feature, input) {
    let steps = [];

    switch (feature) {
      case 'explain':
        steps = [
          'Identify the purpose of the code',
          'List important Angular concepts involved',
          'Explain data flow and state handling',
          'Summarize the overall behavior'
        ];
        break;

      case 'review':
        steps = [
          'Scan for code smells and anti-patterns',
          'Check Angular best practices',
          'Analyze performance implications',
          'Suggest concrete improvements'
        ];
        break;

      case 'debug':
        steps = [
          'Check for syntax or typing issues',
          'Analyze Angular lifecycle usage',
          'Inspect async / observable logic',
          'Identify likely runtime failure points',
          'Propose fixes'
        ];
        break;

      default:
        throw new Error(`Unsupported feature: ${feature}`);
    }

    return {
      type: 'agentic',
      systemPrompt: SYSTEM_PROMPT,
      steps,
      input
    };
  }
}

module.exports = PromptFactory;
