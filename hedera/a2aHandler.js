/**
 * A2A Message Handler
 * Handles Agent-to-Agent communication for negotiation
 */
export class A2AMessageHandler {
  constructor(agentName, agentEndpoint) {
    this.agentName = agentName;
    this.agentEndpoint = agentEndpoint;
    this.messageHistory = [];
  }

  /**
   * Create a negotiation message
   * @param {string} recipient - Recipient agent name
   * @param {Object} content - Message content
   * @returns {Object} A2A message
   */
  createMessage(recipient, content) {
    const message = {
      messageId: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      sender: {
        name: this.agentName,
        endpoint: this.agentEndpoint,
      },
      recipient: {
        name: recipient,
      },
      content,
      protocol: 'A2A',
      version: '1.0',
    };

    this.messageHistory.push(message);
    return message;
  }

  /**
   * Create a negotiation offer message
   * @param {string} recipient - Recipient agent name
   * @param {Object} offer - Offer details
   * @returns {Object} A2A message
   */
  createOfferMessage(recipient, offer) {
    return this.createMessage(recipient, {
      type: 'negotiation.offer',
      offer: {
        productName: offer.productName,
        price: offer.price,
        currency: offer.currency || 'HBAR',
        description: offer.description,
        offerId: offer.offerId || `offer-${Date.now()}`,
      },
    });
  }

  /**
   * Create a counter-offer message
   * @param {string} recipient - Recipient agent name
   * @param {Object} counterOffer - Counter-offer details
   * @returns {Object} A2A message
   */
  createCounterOfferMessage(recipient, counterOffer) {
    return this.createMessage(recipient, {
      type: 'negotiation.counter_offer',
      counterOffer: {
        originalOfferId: counterOffer.originalOfferId,
        productName: counterOffer.productName,
        price: counterOffer.price,
        currency: counterOffer.currency || 'HBAR',
        reason: counterOffer.reason,
        offerId: counterOffer.offerId || `counter-${Date.now()}`,
      },
    });
  }

  /**
   * Create an acceptance message
   * @param {string} recipient - Recipient agent name
   * @param {Object} acceptance - Acceptance details
   * @returns {Object} A2A message
   */
  createAcceptanceMessage(recipient, acceptance) {
    return this.createMessage(recipient, {
      type: 'negotiation.accept',
      acceptance: {
        offerId: acceptance.offerId,
        productName: acceptance.productName,
        agreedPrice: acceptance.agreedPrice,
        currency: acceptance.currency || 'HBAR',
      },
    });
  }

  /**
   * Create a rejection message
   * @param {string} recipient - Recipient agent name
   * @param {Object} rejection - Rejection details
   * @returns {Object} A2A message
   */
  createRejectionMessage(recipient, rejection) {
    return this.createMessage(recipient, {
      type: 'negotiation.reject',
      rejection: {
        offerId: rejection.offerId,
        reason: rejection.reason,
      },
    });
  }

  /**
   * Create a payment request message (AP2)
   * @param {string} recipient - Recipient agent name
   * @param {Object} paymentRequest - Payment request details
   * @returns {Object} A2A message with AP2 payment request
   */
  createPaymentRequestMessage(recipient, paymentRequest) {
    return this.createMessage(recipient, {
      type: 'payment.request',
      payment: {
        invoiceId: paymentRequest.invoiceId,
        amount: paymentRequest.amount,
        currency: paymentRequest.currency || 'HBAR',
        payTo: paymentRequest.payTo,
        productName: paymentRequest.productName,
        description: paymentRequest.description,
      },
    });
  }

  /**
   * Create a payment confirmation message
   * @param {string} recipient - Recipient agent name
   * @param {Object} paymentConfirmation - Payment confirmation details
   * @returns {Object} A2A message
   */
  createPaymentConfirmationMessage(recipient, paymentConfirmation) {
    return this.createMessage(recipient, {
      type: 'payment.confirmation',
      payment: {
        invoiceId: paymentConfirmation.invoiceId,
        transactionId: paymentConfirmation.transactionId,
        amount: paymentConfirmation.amount,
        currency: paymentConfirmation.currency || 'HBAR',
        status: 'completed',
      },
    });
  }

  /**
   * Parse received message
   * @param {Object} message - Received A2A message
   * @returns {Object} Parsed message content
   */
  parseMessage(message) {
    this.messageHistory.push(message);
    return {
      messageId: message.messageId,
      sender: message.sender.name,
      type: message.content.type,
      content: message.content,
      timestamp: message.timestamp,
    };
  }

  /**
   * Get message history
   * @returns {Array} Array of messages
   */
  getHistory() {
    return this.messageHistory;
  }

  /**
   * Log message for debugging
   * @param {Object} message - Message to log
   * @param {string} direction - 'sent' or 'received'
   */
  logMessage(message, direction = 'sent') {
    const arrow = direction === 'sent' ? '→' : '←';
    const emoji = direction === 'sent' ? '📤' : '📥';
    
    console.log(`\n${emoji} ${arrow} A2A Message ${arrow}`);
    console.log(`   From: ${message.sender.name}`);
    console.log(`   To: ${message.recipient.name}`);
    console.log(`   Type: ${message.content.type}`);
    console.log(`   ID: ${message.messageId}`);
    console.log(`   Content:`, JSON.stringify(message.content, null, 2));
  }
}

