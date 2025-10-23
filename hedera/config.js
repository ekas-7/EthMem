import dotenv from 'dotenv';
dotenv.config();

export const config = {
  // Hedera Configuration
  hedera: {
    network: 'testnet',
    seller: {
      accountId: process.env.HEDERA_ACCOUNT_ID,
      privateKey: process.env.HEDERA_PRIVATE_KEY,
    },
    buyer: {
      accountId: process.env.BUYER_ACCOUNT_ID || process.env.HEDERA_ACCOUNT_ID,
      privateKey: process.env.BUYER_PRIVATE_KEY || process.env.HEDERA_PRIVATE_KEY,
    },
  },

  // A2A Protocol Configuration
  a2a: {
    seller: {
      name: process.env.A2A_AGENT_NAME_SELLER || 'EcommerceSellerAgent',
      endpoint: process.env.A2A_ENDPOINT_SELLER || 'http://localhost:3001',
      description: 'AI-powered e-commerce seller agent that negotiates product prices',
    },
    buyer: {
      name: process.env.A2A_AGENT_NAME_BUYER || 'EcommerceBuyerAgent',
      endpoint: process.env.A2A_ENDPOINT_BUYER || 'http://localhost:3002',
      description: 'AI-powered e-commerce buyer agent that negotiates for best prices',
    },
  },

  // Product Configuration
  product: {
    name: process.env.PRODUCT_NAME || 'Premium Wireless Headphones',
    initialPrice: parseFloat(process.env.PRODUCT_INITIAL_PRICE) || 150,
    minPrice: parseFloat(process.env.PRODUCT_MIN_PRICE) || 100,
    description: process.env.PRODUCT_DESCRIPTION || 'High-quality noise-canceling wireless headphones',
  },

  // AI Model Configuration
  ai: {
    openaiKey: process.env.OPENAI_API_KEY,
    anthropicKey: process.env.ANTHROPIC_API_KEY,
    groqKey: process.env.GROQ_API_KEY,
  },
};

