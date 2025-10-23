import { Client, PrivateKey } from '@hashgraph/sdk';
import { ChatOpenAI } from '@langchain/openai';
import { createAgent, HumanMessage } from 'langchain';
import {
  HederaLangchainToolkit,
  AgentMode,
  coreQueriesPlugin,
  coreAccountPlugin,
  coreConsensusPlugin,
  coreTokenPlugin,
} from 'hedera-agent-kit';
import { A2AMessageHandler } from './a2aHandler.js';
import { PaymentHandler } from './paymentHandler.js';
import { config } from './config.js';

/**
 * Buyer Agent - AI-powered e-commerce buyer
 * Uses Hedera Agent Kit and A2A protocol for negotiation
 */
export class BuyerAgent {
  constructor() {
    this.config = config;
    this.targetPrice = Math.round(this.config.product.initialPrice * 0.7); // Start at 70% of asking price
    this.maxPrice = this.config.product.initialPrice;
    this.negotiationRounds = 0;
    this.maxNegotiationRounds = 5;
  }

  /**
   * Initialize the buyer agent
   */
  async initialize() {
    console.log('\n🛒 Initializing Buyer Agent...');
    
    // Initialize Hedera client
    this.client = Client.forTestnet().setOperator(
      this.config.hedera.buyer.accountId,
      PrivateKey.fromStringECDSA(this.config.hedera.buyer.privateKey)
    );

    // Initialize AI model
    this.llm = await this.createLLM();

    // Initialize Hedera Agent Toolkit
    this.hederaToolkit = new HederaLangchainToolkit({
      client: this.client,
      configuration: {
        tools: [],
        context: {
          mode: AgentMode.AUTONOMOUS,
        },
        plugins: [
          coreQueriesPlugin,
          coreAccountPlugin,
          coreConsensusPlugin,
          coreTokenPlugin,
        ],
      },
    });

    // Get tools from toolkit
    const tools = this.hederaToolkit.getTools();

    // Create the agent
    this.agent = createAgent({
      model: this.llm,
      tools,
    });

    // Initialize A2A handler
    this.a2aHandler = new A2AMessageHandler(
      this.config.a2a.buyer.name,
      this.config.a2a.buyer.endpoint
    );

    // Initialize payment handler
    this.paymentHandler = new PaymentHandler(
      this.client,
      this.config.hedera.buyer.accountId
    );

    console.log(`✅ Buyer Agent initialized`);
    console.log(`   Account: ${this.config.hedera.buyer.accountId}`);
    console.log(`   Target Price: ${this.targetPrice} HBAR`);
    console.log(`   Maximum Price: ${this.maxPrice} HBAR`);
  }

  /**
   * Create LLM based on available API keys
   */
  async createLLM() {
    if (this.config.ai.openaiKey) {
      return new ChatOpenAI({ model: 'gpt-4o-mini' });
    }
    
    if (this.config.ai.anthropicKey) {
      const { ChatAnthropic } = await import('@langchain/anthropic');
      return new ChatAnthropic({ model: 'claude-3-haiku-20240307' });
    }
    
    if (this.config.ai.groqKey) {
      const { ChatGroq } = await import('@langchain/groq');
      return new ChatGroq({ model: 'llama-3.3-70b-versatile' });
    }

    throw new Error('No AI provider configured. Please set an API key in .env');
  }

  /**
   * Process initial offer from seller
   * @param {Object} offer - Initial offer from seller
   * @returns {Object} Counter-offer message
   */
  async processOffer(offer) {
    this.negotiationRounds++;
    
    console.log(`\n🤔 Buyer analyzing offer (Round ${this.negotiationRounds}/${this.maxNegotiationRounds})...`);
    console.log(`   Seller's price: ${offer.price} HBAR`);
    console.log(`   Target price: ${this.targetPrice} HBAR`);
    console.log(`   Maximum willing to pay: ${this.maxPrice} HBAR`);

    // Use AI to decide on counter-offer strategy
    // Note: AI agent call can be slow, so we use smart logic-based decision making
    // For production, you can enable AI by uncommenting below:
    /*
    const aiPrompt = `You are a buyer agent negotiating for "${this.config.product.name}".
Seller's asking price: ${offer.price} HBAR
Your target price: ${this.targetPrice} HBAR
Maximum you're willing to pay: ${this.maxPrice} HBAR
Negotiation round: ${this.negotiationRounds} of ${this.maxNegotiationRounds}

Should you:
1. Accept the offer (if it's <= your max price and a good deal)
2. Make a counter-offer (if there's room to negotiate)
3. Reject (if price is too high)

Respond with: ACCEPT, COUNTER:<price>, or REJECT`;

    const response = await this.agent.invoke({
      messages: [new HumanMessage(aiPrompt)]
    });
    */

    // Use smart negotiation logic
    const decision = this.parseAIDecision(null, offer.price);

    return this.createResponse(decision, offer);
  }

  /**
   * Parse AI decision
   */
  parseAIDecision(response, sellerPrice) {
    // Simple decision logic (can be enhanced with AI parsing)
    if (sellerPrice <= this.targetPrice) {
      return { action: 'ACCEPT', price: sellerPrice };
    } else if (sellerPrice <= this.maxPrice && this.negotiationRounds < this.maxNegotiationRounds) {
      // Gradually increase offer towards seller's price
      const increment = Math.round((sellerPrice - this.targetPrice) / (this.maxNegotiationRounds - this.negotiationRounds + 1));
      const counterPrice = Math.min(this.maxPrice, this.targetPrice + increment);
      return { action: 'COUNTER', price: counterPrice };
    } else if (sellerPrice <= this.maxPrice) {
      // Last round, accept if within budget
      return { action: 'ACCEPT', price: sellerPrice };
    } else {
      return { action: 'REJECT' };
    }
  }

  /**
   * Create response based on decision
   */
  createResponse(decision, originalOffer) {
    let message;

    if (decision.action === 'ACCEPT') {
      console.log(`✅ Buyer accepts offer at ${decision.price} HBAR`);
      
      message = this.a2aHandler.createAcceptanceMessage(
        this.config.a2a.seller.name,
        {
          offerId: originalOffer.offerId,
          productName: this.config.product.name,
          agreedPrice: decision.price,
          currency: 'HBAR',
        }
      );

      this.a2aHandler.logMessage(message, 'sent');
      return { acceptance: message, agreedPrice: decision.price };
    } else if (decision.action === 'COUNTER') {
      console.log(`💬 Buyer counter-offers at ${decision.price} HBAR`);
      
      this.targetPrice = decision.price;
      
      message = this.a2aHandler.createCounterOfferMessage(
        this.config.a2a.seller.name,
        {
          originalOfferId: originalOffer.offerId,
          productName: this.config.product.name,
          price: decision.price,
          currency: 'HBAR',
          reason: `I can offer ${decision.price} HBAR for this product`,
          offerId: `counter-${Date.now()}`,
        }
      );

      this.a2aHandler.logMessage(message, 'sent');
      return { counterOffer: message };
    } else {
      console.log(`❌ Buyer rejects offer - price too high`);
      
      message = this.a2aHandler.createRejectionMessage(
        this.config.a2a.seller.name,
        {
          offerId: originalOffer.offerId,
          reason: `Price of ${originalOffer.price} HBAR exceeds my budget`,
        }
      );

      this.a2aHandler.logMessage(message, 'sent');
      return { rejection: message };
    }
  }

  /**
   * Process payment request and make payment
   * @param {Object} paymentRequest - Payment request from seller
   * @returns {Object} Payment confirmation
   */
  async processPaymentRequest(paymentRequest) {
    console.log(`\n💳 Buyer processing payment request...`);
    
    // Handle both message format and direct payment format
    const payment = paymentRequest.content?.payment || paymentRequest.payment || paymentRequest;
    
    console.log(`   Amount: ${payment.amount} HBAR`);
    console.log(`   Pay to: ${payment.payTo}`);

    // Make payment via Hedera
    const paymentResult = await this.paymentHandler.sendPayment(
      payment.payTo,
      payment.amount,
      `Payment for ${payment.productName} - Invoice: ${payment.invoiceId}`
    );

    if (paymentResult.success) {
      // Send payment confirmation
      const confirmationMessage = this.a2aHandler.createPaymentConfirmationMessage(
        this.config.a2a.seller.name,
        {
          invoiceId: payment.invoiceId,
          transactionId: paymentResult.transactionId,
          amount: paymentResult.amount,
          currency: 'HBAR',
        }
      );

      this.a2aHandler.logMessage(confirmationMessage, 'sent');
      return { success: true, confirmation: confirmationMessage, payment: paymentResult };
    } else {
      console.log(`❌ Payment failed: ${paymentResult.error}`);
      return { success: false, error: paymentResult.error };
    }
  }

  /**
   * Get agent balance
   */
  async getBalance() {
    return await this.paymentHandler.getBalance();
  }

  /**
   * Cleanup
   */
  async cleanup() {
    if (this.client) {
      this.client.close();
    }
  }
}

