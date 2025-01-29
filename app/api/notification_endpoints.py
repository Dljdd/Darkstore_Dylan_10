from fastapi import APIRouter, HTTPException, Depends
from ..models.notification_preferences import NotificationPreferences, UpdateNotificationPreferences
from ..services.notification_service import NotificationService
from typing import Dict, List
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

notification_service = NotificationService()

@router.post("/notifications/preferences")
async def set_notification_preferences(
    preferences: NotificationPreferences
) -> Dict[str, str]:
    """Set user notification preferences"""
    try:
        # Here you would typically save these preferences to your database
        # For now, we'll just return a success message
        return {
            "status": "success",
            "message": "Notification preferences updated successfully"
        }
    except Exception as e:
        logger.error(f"Error setting notification preferences: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/notifications/preferences/{user_id}")
async def update_notification_preferences(
    user_id: str,
    preferences: UpdateNotificationPreferences
) -> Dict[str, str]:
    """Update user notification preferences"""
    try:
        # Here you would typically update these preferences in your database
        return {
            "status": "success",
            "message": "Notification preferences updated successfully"
        }
    except Exception as e:
        logger.error(f"Error updating notification preferences: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/notifications/test")
async def test_notification(
    phone_number: str
) -> Dict[str, str]:
    """Send a test notification"""
    try:
        result = notification_service.send_low_stock_alert(
            to_number=phone_number,
            product_name="Test Product",
            current_stock=5,
            warehouse_location="Test Warehouse",
            reorder_quantity=100,
            threshold=10
        )
        return result
    except Exception as e:
        logger.error(f"Error sending test notification: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/notifications/opt-out/{user_id}")
async def opt_out_notifications(
    user_id: str
) -> Dict[str, str]:
    """Opt-out of notifications"""
    try:
        # Here you would typically update the user's preferences in your database
        return {
            "status": "success",
            "message": "Successfully opted out of notifications"
        }
    except Exception as e:
        logger.error(f"Error opting out of notifications: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
