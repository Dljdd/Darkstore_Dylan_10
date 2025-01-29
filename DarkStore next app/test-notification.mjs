import fetch from 'node-fetch';
import https from 'https';

// Create an HTTPS agent that doesn't validate certificates
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

// Test script for WhatsApp notifications
const testNotification = async () => {
  try {
    console.log('🚀 Sending test WhatsApp notification...');
    
    const response = await fetch('https://localhost:3000/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phoneNumber: '+918169936057',  // Your number from the example
        productName: 'Premium Coffee Beans',
        currentStock: 5,
        warehouseLocation: 'Mumbai Central Warehouse',
        threshold: 10,
        avgMonthlyDemand: 100
      }),
      agent: httpsAgent // Add the HTTPS agent
    });

    const result = await response.json();
    console.log('\nResponse from server:', result);

    if (result.success) {
      console.log('\n✅ WhatsApp message sent successfully!');
      console.log('📱 Message ID:', result.messageId);
      console.log('\nThe message should be delivered to your WhatsApp shortly.');
      console.log('Please check your WhatsApp for the notification.');
    } else {
      console.error('\n❌ Failed to send message:', result.error);
    }
  } catch (error) {
    console.error('\n❌ Error testing notification:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n⚠️ Make sure the Next.js server is running on port 3000');
    }
  }
};

// Run the test
console.log('📲 WhatsApp Notification Test');
console.log('============================');
testNotification();
