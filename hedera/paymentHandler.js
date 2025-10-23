import { TransferTransaction, Hbar, AccountId } from '@hashgraph/sdk';

/**
 * Payment Handler for Hedera Network
 * Handles HBAR transfers between buyer and seller
 */
export class PaymentHandler {
  constructor(client, accountId) {
    this.client = client;
    this.accountId = accountId;
  }

  /**
   * Send HBAR payment to recipient
   * @param {string} recipientId - Hedera account ID of recipient
   * @param {number} amount - Amount in HBAR
   * @param {string} memo - Transaction memo
   * @returns {Promise<Object>} Transaction result
   */
  async sendPayment(recipientId, amount, memo = '') {
    try {
      console.log(`\n💰 Initiating payment of ${amount} HBAR to ${recipientId}...`);
      
      const transaction = new TransferTransaction()
        .addHbarTransfer(this.accountId, new Hbar(-amount))
        .addHbarTransfer(AccountId.fromString(recipientId), new Hbar(amount))
        .setTransactionMemo(memo);

      const txResponse = await transaction.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);

      console.log(`✅ Payment successful! Transaction ID: ${txResponse.transactionId.toString()}`);
      console.log(`   Status: ${receipt.status.toString()}`);

      return {
        success: true,
        transactionId: txResponse.transactionId.toString(),
        status: receipt.status.toString(),
        amount,
        recipient: recipientId,
        memo,
      };
    } catch (error) {
      console.error(`❌ Payment failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Check account balance
   * @returns {Promise<number>} Balance in HBAR
   */
  async getBalance() {
    try {
      const { AccountBalanceQuery } = await import('@hashgraph/sdk');
      const query = new AccountBalanceQuery()
        .setAccountId(this.accountId);
      
      const balance = await query.execute(this.client);
      return balance.hbars.toBigNumber().toNumber();
    } catch (error) {
      console.error(`❌ Failed to get balance: ${error.message}`);
      return 0;
    }
  }

  /**
   * Create an invoice for payment
   * @param {number} amount - Amount in HBAR
   * @param {string} productName - Name of product
   * @param {string} description - Invoice description
   * @returns {Object} Invoice object
   */
  createInvoice(amount, productName, description) {
    return {
      invoiceId: `INV-${Date.now()}`,
      amount,
      currency: 'HBAR',
      productName,
      description,
      payTo: this.accountId,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
  }

  /**
   * Verify payment was received
   * @param {string} transactionId - Transaction ID to verify
   * @returns {Promise<boolean>} True if payment verified
   */
  async verifyPayment(transactionId) {
    try {
      // In a real implementation, you would query the transaction
      // For now, we'll return true if transactionId exists
      return !!transactionId;
    } catch (error) {
      console.error(`❌ Payment verification failed: ${error.message}`);
      return false;
    }
  }
}

