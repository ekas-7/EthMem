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
 * Seller Agent - AI-powered e-commerce seller
 * Uses Hedera Agent Kit and A2A protocol for negotiation
 */
export class SellerAgent {
  constructor() {
    this.config = config;
    this.productPrice = this.config.product.initialPrice;
    this.minPrice = this.config.product.minPrice;
    this.negotiationRounds = 0;
    this.maxNegotiationRounds = 5;
  }

  /**
   * Initialize the seller agent
   */
  async initialize() {
    console.log('\n🏪 Initializing Seller Agent...');
    
    // Initialize Hedera client
    this.client = Client.forTestnet().setOperator(
      this.config.hedera.seller.accountId,
      PrivateKey.fromStringECDSA(this.config.hedera.seller.privateKey)
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
      this.config.a2a.seller.name,
      this.config.a2a.seller.endpoint
    );

    // Initialize payment handler
    this.paymentHandler = new PaymentHandler(
      this.client,
      this.config.hedera.seller.accountId
    );

    console.log(`✅ Seller Agent initialized`);
    console.log(`   Account: ${this.config.hedera.seller.accountId}`);
    console.log(`   Product: ${this.config.product.name}`);
    console.log(`   Initial Price: ${this.productPrice} HBAR`);
    console.log(`   Minimum Price: ${this.minPrice} HBAR`);
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
   * Create initial offer
   */
  createInitialOffer() {
    const offer = {
      productName: this.config.product.name,
      price: this.productPrice,
      currency: 'HBAR',
      description: this.config.product.description,
      offerId: `offer-${Date.now()}`,
    };

    const message = this.a2aHandler.createOfferMessage(
      this.config.a2a.buyer.name,
      offer
    );

    this.a2aHandler.logMessage(message, 'sent');
    return message;
  }

  /**
   * Process counter-offer from buyer
   * @param {Object} counterOffer - Counter-offer from buyer
   * @returns {Object} Response message
   */
  async processCounterOffer(counterOffer) {
    this.negotiationRounds++;
    
    console.log(`\n🤔 Seller analyzing counter-offer (Round ${this.negotiationRounds}/${this.maxNegotiationRounds})...`);
    console.log(`   Buyer's offer: ${counterOffer.price} HBAR`);
    console.log(`   Current price: ${this.productPrice} HBAR`);
    console.log(`   Minimum acceptable: ${this.minPrice} HBAR`);

    // Use AI to decide on counter-offer strategy
    // Note: AI agent call can be slow, so we use smart logic-based decision making
    // For production, you can enable AI by uncommenting below:
    /*
    const aiPrompt = `You are a seller agent negotiating the price of "${this.config.product.name}".
Current asking price: ${this.productPrice} HBAR
Minimum acceptable price: ${this.minPrice} HBAR
Buyer's counter-offer: ${counterOffer.price} HBAR
Negotiation round: ${this.negotiationRounds} of ${this.maxNegotiationRounds}

Should you:
1. Accept the offer (if it's >= minimum price)
2. Make a counter-offer (if there's room to negotiate)
3. Reject (if offer is too low and no room for negotiation)

Respond with: ACCEPT, COUNTER:<price>, or REJECT`;

    const response = await this.agent.invoke({
      messages: [new HumanMessage(aiPrompt)]
    });
    */

    // Use smart negotiation logic
    const decision = this.parseAIDecision(null, counterOffer.price);

    return this.createResponse(decision, counterOffer);
  }

  /**
   * Parse AI decision
   */
  parseAIDecision(response, buyerPrice) {
    // Simple decision logic (can be enhanced with AI parsing)
    if (buyerPrice >= this.minPrice) {
      return { action: 'ACCEPT', price: buyerPrice };
    } else if (this.negotiationRounds < this.maxNegotiationRounds) {
      const counterPrice = Math.max(
        this.minPrice,
        Math.round((this.productPrice + buyerPrice) / 2)
      );
      return { action: 'COUNTER', price: counterPrice };
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
      console.log(`✅ Seller accepts offer at ${decision.price} HBAR`);
      
      message = this.a2aHandler.createAcceptanceMessage(
        this.config.a2a.buyer.name,
        {
          offerId: originalOffer.offerId,
          productName: this.config.product.name,
          agreedPrice: decision.price,
          currency: 'HBAR',
        }
      );

      // Create invoice
      const invoice = this.paymentHandler.createInvoice(
        decision.price,
        this.config.product.name,
        'Payment for negotiated product'
      );

      // Send payment request
      const paymentMessage = this.a2aHandler.createPaymentRequestMessage(
        this.config.a2a.buyer.name,
        invoice
      );

      this.a2aHandler.logMessage(message, 'sent');
      this.a2aHandler.logMessage(paymentMessage, 'sent');

      return { acceptance: message, paymentRequest: paymentMessage, invoice };
    } else if (decision.action === 'COUNTER') {
      console.log(`💬 Seller counter-offers at ${decision.price} HBAR`);
      
      this.productPrice = decision.price;
      
      message = this.a2aHandler.createCounterOfferMessage(
        this.config.a2a.buyer.name,
        {
          originalOfferId: originalOffer.offerId,
          productName: this.config.product.name,
          price: decision.price,
          currency: 'HBAR',
          reason: `Best price I can offer is ${decision.price} HBAR`,
          offerId: `counter-${Date.now()}`,
        }
      );

      this.a2aHandler.logMessage(message, 'sent');
      return { counterOffer: message };
    } else {
      console.log(`❌ Seller rejects offer - price too low`);
      
      message = this.a2aHandler.createRejectionMessage(
        this.config.a2a.buyer.name,
        {
          offerId: originalOffer.offerId,
          reason: `Offer of ${originalOffer.price} HBAR is below minimum acceptable price`,
        }
      );

      this.a2aHandler.logMessage(message, 'sent');
      return { rejection: message };
    }
  }

  /**
   * Process payment confirmation
   */
  async processPaymentConfirmation(paymentInfo) {
    console.log(`\n💰 Seller received payment confirmation`);
    console.log(`   Transaction ID: ${paymentInfo.transactionId}`);
    console.log(`   Amount: ${paymentInfo.amount} HBAR`);

    // Verify payment
    const verified = await this.paymentHandler.verifyPayment(paymentInfo.transactionId);

    if (verified) {
      console.log(`✅ Payment verified! Transaction complete.`);
      return { success: true, message: 'Payment received and verified' };
    } else {
      console.log(`❌ Payment verification failed`);
      return { success: false, message: 'Payment verification failed' };
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

