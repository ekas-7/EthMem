import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { SellerAgent } from './sellerAgent.js';
import { BuyerAgent } from './buyerAgent.js';
import { config } from './config.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Store active WebSocket connections
const clients = new Set();

// Create HTTP server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Create WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('📡 Client connected');
  clients.add(ws);

  ws.on('close', () => {
    console.log('📡 Client disconnected');
    clients.delete(ws);
  });
});

// Broadcast message to all connected clients
function broadcast(message) {
  const data = JSON.stringify(message);
  clients.forEach(client => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(data);
    }
  });
}

// Start negotiation endpoint
app.post('/api/negotiate/start', async (req, res) => {
  try {
    console.log('\n🎬 Starting negotiation...');
    
    // Send initial status
    broadcast({
      type: 'status',
      data: { status: 'initializing', message: 'Initializing agents...' }
    });

    // Initialize agents
    const seller = new SellerAgent();
    const buyer = new BuyerAgent();

    await seller.initialize();
    await buyer.initialize();

    // Get initial balances
    const sellerBalance = await seller.getBalance();
    const buyerBalance = await buyer.getBalance();

    broadcast({
      type: 'agents_initialized',
      data: {
        seller: {
          name: 'Seller Agent',
          account: config.hedera.seller.accountId,
          balance: sellerBalance,
          role: 'seller'
        },
        buyer: {
          name: 'Buyer Agent',
          account: config.hedera.buyer.accountId,
          balance: buyerBalance,
          role: 'buyer'
        }
      }
    });

    // Start negotiation
    broadcast({
      type: 'status',
      data: { status: 'negotiating', message: 'Starting negotiation...' }
    });

    // Seller creates initial offer
    const initialOffer = seller.createInitialOffer();
    broadcast({
      type: 'message',
      data: {
        from: 'seller',
        to: 'buyer',
        messageType: 'offer',
        content: initialOffer.content,
        timestamp: initialOffer.timestamp
      }
    });

    // Buyer processes offer
    let currentOffer = initialOffer.content.offer;
    let negotiationComplete = false;
    let agreedPrice = null;
    let finalResult = null;

    while (!negotiationComplete && seller.negotiationRounds < seller.maxNegotiationRounds) {
      // Buyer responds to offer
      const buyerResponse = await buyer.processOffer(currentOffer);

      if (buyerResponse.acceptance) {
        // Buyer accepted
        broadcast({
          type: 'message',
          data: {
            from: 'buyer',
            to: 'seller',
            messageType: 'accept',
            content: buyerResponse.acceptance.content,
            timestamp: buyerResponse.acceptance.timestamp
          }
        });

        agreedPrice = buyerResponse.agreedPrice;
        negotiationComplete = true;

        // Seller processes acceptance and sends payment request
        const sellerResponse = seller.createResponse(
          { action: 'ACCEPT', price: agreedPrice },
          { offerId: currentOffer.offerId }
        );

        if (sellerResponse.paymentRequest) {
          broadcast({
            type: 'message',
            data: {
              from: 'seller',
              to: 'buyer',
              messageType: 'payment_request',
              content: sellerResponse.paymentRequest.content,
              timestamp: sellerResponse.paymentRequest.timestamp
            }
          });

          // Buyer processes payment
          const paymentResult = await buyer.processPaymentRequest(sellerResponse.paymentRequest);

          if (paymentResult.success) {
            broadcast({
              type: 'message',
              data: {
                from: 'buyer',
                to: 'seller',
                messageType: 'payment',
                content: paymentResult.confirmation.content,
                timestamp: paymentResult.confirmation.timestamp
              }
            });

            // Seller confirms payment
            await seller.processPaymentConfirmation(paymentResult.payment);

            finalResult = {
              success: true,
              agreedPrice,
              transactionId: paymentResult.payment.transactionId,
              savings: config.product.initialPrice - agreedPrice
            };
          } else {
            finalResult = {
              success: false,
              error: 'Payment failed'
            };
          }
        }
      } else if (buyerResponse.counterOffer) {
        // Buyer made counter-offer
        broadcast({
          type: 'message',
          data: {
            from: 'buyer',
            to: 'seller',
            messageType: 'counter_offer',
            content: buyerResponse.counterOffer.content,
            timestamp: buyerResponse.counterOffer.timestamp
          }
        });

        const counterOffer = buyerResponse.counterOffer.content.counterOffer;
        const sellerResponse = await seller.processCounterOffer(counterOffer);

        if (sellerResponse.acceptance) {
          // Seller accepted counter-offer
          broadcast({
            type: 'message',
            data: {
              from: 'seller',
              to: 'buyer',
              messageType: 'accept',
              content: sellerResponse.acceptance.content,
              timestamp: sellerResponse.acceptance.timestamp
            }
          });

          agreedPrice = counterOffer.price;
          negotiationComplete = true;

          // Process payment
          if (sellerResponse.paymentRequest) {
            broadcast({
              type: 'message',
              data: {
                from: 'seller',
                to: 'buyer',
                messageType: 'payment_request',
                content: sellerResponse.paymentRequest.content,
                timestamp: sellerResponse.paymentRequest.timestamp
              }
            });

            const paymentResult = await buyer.processPaymentRequest(sellerResponse.paymentRequest);

            if (paymentResult.success) {
              broadcast({
                type: 'message',
                data: {
                  from: 'buyer',
                  to: 'seller',
                  messageType: 'payment',
                  content: paymentResult.confirmation.content,
                  timestamp: paymentResult.confirmation.timestamp
                }
              });

              await seller.processPaymentConfirmation(paymentResult.payment);

              finalResult = {
                success: true,
                agreedPrice,
                transactionId: paymentResult.payment.transactionId,
                savings: config.product.initialPrice - agreedPrice
              };
            }
          }
        } else if (sellerResponse.counterOffer) {
          // Seller made counter-offer - continue negotiation
          broadcast({
            type: 'message',
            data: {
              from: 'seller',
              to: 'buyer',
              messageType: 'counter_offer',
              content: sellerResponse.counterOffer.content,
              timestamp: sellerResponse.counterOffer.timestamp
            }
          });

          currentOffer = sellerResponse.counterOffer.content.counterOffer;
        } else if (sellerResponse.rejection) {
          // Seller rejected
          broadcast({
            type: 'message',
            data: {
              from: 'seller',
              to: 'buyer',
              messageType: 'reject',
              content: sellerResponse.rejection.content,
              timestamp: sellerResponse.rejection.timestamp
            }
          });

          negotiationComplete = true;
          finalResult = {
            success: false,
            error: 'Seller rejected offer'
          };
        }
      } else if (buyerResponse.rejection) {
        // Buyer rejected
        broadcast({
          type: 'message',
          data: {
            from: 'buyer',
            to: 'seller',
            messageType: 'reject',
            content: buyerResponse.rejection.content,
            timestamp: buyerResponse.rejection.timestamp
          }
        });

        negotiationComplete = true;
        finalResult = {
          success: false,
          error: 'Buyer rejected offer'
        };
      }
    }

    // Get final balances
    const finalSellerBalance = await seller.getBalance();
    const finalBuyerBalance = await buyer.getBalance();

    // Send final result
    broadcast({
      type: 'negotiation_complete',
      data: {
        ...finalResult,
        rounds: seller.negotiationRounds,
        finalBalances: {
          seller: finalSellerBalance,
          buyer: finalBuyerBalance
        }
      }
    });

    // Cleanup
    await seller.cleanup();
    await buyer.cleanup();

    res.json({ success: true, message: 'Negotiation started' });

  } catch (error) {
    console.error('❌ Error:', error);
    broadcast({
      type: 'error',
      data: { message: error.message }
    });
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get product info
app.get('/api/product', (req, res) => {
  res.json({
    name: config.product.name,
    description: config.product.description,
    initialPrice: config.product.initialPrice,
    minPrice: config.product.minPrice
  });
});

console.log('✅ Server ready');
console.log('📡 WebSocket server ready');

