import { Twilio } from 'twilio';

interface NotificationConfig {
  accountSid: string;
  authToken: string;
  whatsappFromNumber: string;
}

interface StockAlert {
  productName: string;
  currentStock: number;
  warehouseLocation: string;
  reorderQuantity: number;
  threshold: number;
}

export class NotificationService {
  private client: Twilio;
  private whatsappFromNumber: string;

  constructor(config: NotificationConfig) {
    this.client = new Twilio(config.accountSid, config.authToken);
    this.whatsappFromNumber = config.whatsappFromNumber;
  }

  async sendWhatsAppAlert(
    toNumber: string,
    alert: StockAlert
  ): Promise<{ success: boolean; error?: string; messageId?: string }> {
    try {
      // Format the phone number for WhatsApp
      const formattedToNumber = toNumber.startsWith('whatsapp:') ? toNumber : `whatsapp:${toNumber}`;
      const formattedFromNumber = this.whatsappFromNumber.startsWith('whatsapp:') ? 
        this.whatsappFromNumber : `whatsapp:${this.whatsappFromNumber}`;

      const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'https://dashboard.darkstore.com';
      const messageBody = `🚨 *LOW STOCK ALERT*

*Product:* ${alert.productName}
*Current Stock:* ${alert.currentStock} units
*Warehouse:* ${alert.warehouseLocation}
*Reorder Quantity:* ${alert.reorderQuantity} units

View inventory details:
${dashboardUrl}/inventory/${encodeURIComponent(alert.productName)}

_This is an automated alert from DarkStore Inventory Management System._`;

      const message = await this.client.messages.create({
        from: formattedFromNumber,
        to: formattedToNumber,
        body: messageBody
      });

      return { 
        success: true, 
        messageId: message.sid 
      };
    } catch (error) {
      console.error('Failed to send WhatsApp notification:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  calculateReorderQuantity(avgMonthlyDemand: number): number {
    const safetyStock = avgMonthlyDemand * 0.2; // 20% safety stock
    return Math.round(avgMonthlyDemand + safetyStock);
  }
}

// Singleton instance
let notificationService: NotificationService | null = null;

export function getNotificationService(): NotificationService {
  if (!notificationService) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const whatsappFromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

    if (!accountSid || !authToken || !whatsappFromNumber) {
      throw new Error('Missing required Twilio credentials in environment variables');
    }

    notificationService = new NotificationService({
      accountSid,
      authToken,
      whatsappFromNumber
    });
  }

  return notificationService;
}
