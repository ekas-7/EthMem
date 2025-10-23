import { SellerAgent } from './sellerAgent.js';
import { BuyerAgent } from './buyerAgent.js';
import { config } from './config.js';

/**
 * Demo Script - E-commerce Negotiation with A2A and Hedera
 * 
 * This demo shows:
 * 1. Multi-agent communication using A2A protocol
 * 2. AI-powered price negotiation
 * 3. Payment settlement on Hedera network
 * 4. Integration with Hedera Agent Kit
 */

async function runNegotiationDemo() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  E-COMMERCE NEGOTIATION DEMO                               ║');
  console.log('║  AI Agents + A2A Protocol + Hedera Network                 ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  let seller, buyer;

  try {
    // Initialize agents
    console.log('📋 Step 1: Initializing Agents\n');
    seller = new SellerAgent();
    await seller.initialize();

    buyer = new BuyerAgent();
    await buyer.initialize();

    // Check initial balances
    console.log('\n💰 Initial Balances:');
    const sellerBalance = await seller.getBalance();
    const buyerBalance = await buyer.getBalance();
    console.log(`   Seller: ${sellerBalance.toFixed(2)} HBAR`);
    console.log(`   Buyer: ${buyerBalance.toFixed(2)} HBAR`);

    // Start negotiation
    console.log('\n\n📋 Step 2: Starting Negotiation\n');
    console.log('═'.repeat(60));

    // Seller creates initial offer
    const initialOffer = seller.createInitialOffer();
    
    // Buyer processes offer and makes counter-offer
    let currentOffer = initialOffer.content.offer;
    let negotiationComplete = false;
    let agreedPrice = null;
    let invoice = null;

    while (!negotiationComplete && seller.negotiationRounds < seller.maxNegotiationRounds) {
      console.log('\n' + '─'.repeat(60));
      
      // Buyer responds to offer
      const buyerResponse = await buyer.processOffer(currentOffer);

      if (buyerResponse.acceptance) {
        // Buyer accepted - negotiation complete
        console.log('\n🎉 Negotiation successful!');
        agreedPrice = buyerResponse.agreedPrice;
        negotiationComplete = true;

        // Seller processes acceptance and sends payment request
        console.log('\n📋 Step 3: Processing Payment\n');
        console.log('═'.repeat(60));

        const sellerResponse = seller.createResponse(
          { action: 'ACCEPT', price: agreedPrice },
          { offerId: currentOffer.offerId }
        );

        if (sellerResponse.paymentRequest) {
          invoice = sellerResponse.invoice;
          
          // Buyer processes payment request
          const paymentResult = await buyer.processPaymentRequest(sellerResponse.paymentRequest);

          if (paymentResult.success) {
            // Seller confirms payment
            await seller.processPaymentConfirmation(paymentResult.payment);
          } else {
            console.log('❌ Payment failed - transaction aborted');
          }
        }
      } else if (buyerResponse.counterOffer) {
        // Buyer made counter-offer - seller responds
        const counterOffer = buyerResponse.counterOffer.content.counterOffer;
        const sellerResponse = await seller.processCounterOffer(counterOffer);

        if (sellerResponse.acceptance) {
          // Seller accepted counter-offer
          console.log('\n🎉 Negotiation successful!');
          agreedPrice = counterOffer.price;
          negotiationComplete = true;

          // Process payment
          console.log('\n📋 Step 3: Processing Payment\n');
          console.log('═'.repeat(60));

          if (sellerResponse.paymentRequest) {
            invoice = sellerResponse.invoice;
            
            const paymentResult = await buyer.processPaymentRequest(sellerResponse.paymentRequest);

            if (paymentResult.success) {
              await seller.processPaymentConfirmation(paymentResult.payment);
            } else {
              console.log('❌ Payment failed - transaction aborted');
            }
          }
        } else if (sellerResponse.counterOffer) {
          // Seller made counter-offer - continue negotiation
          currentOffer = sellerResponse.counterOffer.content.counterOffer;
        } else if (sellerResponse.rejection) {
          // Seller rejected - negotiation failed
          console.log('\n❌ Negotiation failed - seller rejected offer');
          negotiationComplete = true;
        }
      } else if (buyerResponse.rejection) {
        // Buyer rejected - negotiation failed
        console.log('\n❌ Negotiation failed - buyer rejected offer');
        negotiationComplete = true;
      }
    }

    if (seller.negotiationRounds >= seller.maxNegotiationRounds && !agreedPrice) {
      console.log('\n⏱️  Negotiation timeout - maximum rounds reached');
    }

    // Check final balances
    console.log('\n\n📋 Step 4: Final Results\n');
    console.log('═'.repeat(60));

    const finalSellerBalance = await seller.getBalance();
    const finalBuyerBalance = await buyer.getBalance();

    console.log('\n💰 Final Balances:');
    console.log(`   Seller: ${finalSellerBalance.toFixed(2)} HBAR (${finalSellerBalance > sellerBalance ? '+' : ''}${(finalSellerBalance - sellerBalance).toFixed(2)})`);
    console.log(`   Buyer: ${finalBuyerBalance.toFixed(2)} HBAR (${(finalBuyerBalance - buyerBalance).toFixed(2)})`);

    if (agreedPrice) {
      console.log('\n📊 Transaction Summary:');
      console.log(`   Product: ${config.product.name}`);
      console.log(`   Initial Price: ${config.product.initialPrice} HBAR`);
      console.log(`   Final Price: ${agreedPrice} HBAR`);
      console.log(`   Savings: ${(config.product.initialPrice - agreedPrice).toFixed(2)} HBAR (${((1 - agreedPrice / config.product.initialPrice) * 100).toFixed(1)}%)`);
      console.log(`   Negotiation Rounds: ${seller.negotiationRounds}`);
      if (invoice) {
        console.log(`   Invoice ID: ${invoice.invoiceId}`);
      }
    }

    console.log('\n✅ Demo completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Error during demo:', error.message);
    console.error(error.stack);
  } finally {
    // Cleanup
    if (seller) await seller.cleanup();
    if (buyer) await buyer.cleanup();
  }
}

// Run the demo
console.log('Starting E-commerce Negotiation Demo...\n');
runNegotiationDemo().catch(console.error);

