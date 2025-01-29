from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
import os
from dotenv import load_dotenv
import logging
from typing import Dict, Optional

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class NotificationService:
    def __init__(self):
        self.account_sid = os.getenv('TWILIO_ACCOUNT_SID')
        self.auth_token = os.getenv('TWILIO_AUTH_TOKEN')
        self.from_number = os.getenv('TWILIO_PHONE_NUMBER')
        
        if not all([self.account_sid, self.auth_token, self.from_number]):
            raise ValueError("Missing required Twilio credentials in environment variables")
        
        self.client = Client(self.account_sid, self.auth_token)

    def send_low_stock_alert(
        self,
        to_number: str,
        product_name: str,
        current_stock: int,
        warehouse_location: str,
        reorder_quantity: int,
        threshold: int
    ) -> Dict[str, str]:
        """
        Send a low stock alert SMS notification
        """
        try:
            dashboard_url = os.getenv('DARKSTORE_DASHBOARD_URL', 'https://dashboard.darkstore.com')
            message_body = (
                f"⚠️ Low Stock Alert!\n\n"
                f"Product: {product_name}\n"
                f"Current Stock: {current_stock} (Below threshold of {threshold})\n"
                f"Location: {warehouse_location}\n"
                f"Recommended Reorder: {reorder_quantity} units\n\n"
                f"View Details: {dashboard_url}/inventory/{product_name}"
            )

            message = self.client.messages.create(
                body=message_body,
                from_=self.from_number,
                to=to_number
            )

            logger.info(f"Successfully sent low stock alert for {product_name} to {to_number}")
            return {
                "status": "success",
                "message_sid": message.sid,
                "to": to_number
            }

        except TwilioRestException as e:
            logger.error(f"Failed to send Twilio message: {str(e)}")
            return {
                "status": "error",
                "error": str(e),
                "to": to_number
            }
        except Exception as e:
            logger.error(f"Unexpected error sending notification: {str(e)}")
            return {
                "status": "error",
                "error": str(e),
                "to": to_number
            }

    def check_and_notify_low_stock(
        self,
        product_data: Dict[str, any],
        user_phone: str,
        threshold: Optional[int] = None
    ) -> Dict[str, str]:
        """
        Check if stock is below threshold and send notification if needed
        """
        default_threshold = 10  # Default threshold if none specified
        current_stock = product_data.get('current_stock', 0)
        product_threshold = threshold or product_data.get('threshold', default_threshold)

        if current_stock <= product_threshold:
            reorder_quantity = self._calculate_reorder_quantity(product_data)
            return self.send_low_stock_alert(
                to_number=user_phone,
                product_name=product_data['name'],
                current_stock=current_stock,
                warehouse_location=product_data['warehouse_location'],
                reorder_quantity=reorder_quantity,
                threshold=product_threshold
            )
        return {"status": "skipped", "message": "Stock level above threshold"}

    def _calculate_reorder_quantity(self, product_data: Dict[str, any]) -> int:
        """
        Calculate the recommended reorder quantity based on historical data
        """
        # Simple calculation - can be enhanced with more sophisticated logic
        base_quantity = product_data.get('avg_monthly_demand', 100)
        safety_stock = base_quantity * 0.2  # 20% safety stock
        return round(base_quantity + safety_stock)
