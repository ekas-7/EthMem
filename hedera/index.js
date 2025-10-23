import dotenv from 'dotenv';
dotenv.config();

import { ChatOpenAI } from '@langchain/openai';
import { createAgent, HumanMessage } from 'langchain';
import { Client, PrivateKey } from '@hashgraph/sdk';
import { 
  HederaLangchainToolkit,
  AgentMode, 
  coreQueriesPlugin,
  coreAccountPlugin, 
  coreConsensusPlugin, 
  coreTokenPlugin 
} from 'hedera-agent-kit';

// Choose your AI provider (install the one you want to use)
async function createLLM() {
  // Option 1: OpenAI (requires OPENAI_API_KEY in .env)
  if (process.env.OPENAI_API_KEY) {
    return new ChatOpenAI({ model: 'gpt-4o-mini' });
  }
  
  // Option 2: Anthropic Claude (requires ANTHROPIC_API_KEY in .env)
  if (process.env.ANTHROPIC_API_KEY) {
    const { ChatAnthropic } = await import('@langchain/anthropic');
    return new ChatAnthropic({ model: 'claude-3-haiku-20240307' });
  }
  
  // Option 3: Groq (requires GROQ_API_KEY in .env)
  if (process.env.GROQ_API_KEY) {
    const { ChatGroq } = await import('@langchain/groq');
    return new ChatGroq({ model: 'llama-3.3-70b-versatile' });
  }
  
  // Option 4: Ollama (free, local - requires Ollama installed and running)
  try {
    const { ChatOllama } = await import('@langchain/ollama');
    return new ChatOllama({ 
      model: 'llama3.2',
      baseUrl: 'http://localhost:11434'
    });
  } catch (e) {
    console.error('No AI provider configured. Please either:');
    console.error('1. Set OPENAI_API_KEY, ANTHROPIC_API_KEY, or GROQ_API_KEY in .env');
    console.error('2. Install and run Ollama locally (https://ollama.com)');
    process.exit(1);
  }
}

async function main() {
  // Initialize AI model
  const llm = await createLLM();

  // Hedera client setup (Testnet by default)
  const client = Client.forTestnet().setOperator(
    process.env.HEDERA_ACCOUNT_ID,
    PrivateKey.fromStringECDSA(process.env.HEDERA_PRIVATE_KEY),
  );

  const hederaAgentToolkit = new HederaLangchainToolkit({
    client,
    configuration: {
      tools: [], // use an empty array to load all tools from plugins
      context: {
        mode: AgentMode.AUTONOMOUS,
      },
      plugins: [
        coreQueriesPlugin,    // For account queries and balances
        coreAccountPlugin,    // For HBAR transfers
        coreConsensusPlugin,  // For HCS topics and messages
        coreTokenPlugin,        // For token operations
      ], // use an empty array to load all core plugins
    },
  });
  
  // Fetch tools from toolkit
  const tools = hederaAgentToolkit.getTools();

  // Create the agent using the new createAgent function
  const agent = createAgent({
    model: llm,
    tools,
  });
  
  const response = await agent.invoke({
    messages: [new HumanMessage("what's my balance?")]
  });
  console.log(response);
}

main().catch(console.error);