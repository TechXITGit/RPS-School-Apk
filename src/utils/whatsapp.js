// WhatsApp Deep-Linking & Business Messaging Utility for RPS Admin Panel
import { Linking, Alert } from 'react-native';
import { formatINR } from './currencyUtils';

/**
 * Cleans phone number by stripping spaces, hyphens, and leading +
 * Defaults to Indian country code (91) if 10 digits provided
 */
export function cleanPhoneNumber(phone) {
  if (!phone) return '';
  let cleaned = phone.toString().replace(/[^0-9]/g, '');

  // If standard 10 digit Indian number without country code
  if (cleaned.length === 10) {
    cleaned = `91${cleaned}`;
  }
  return cleaned;
}

/**
 * Generates and opens WhatsApp deep link with encoded message
 */
export async function openWhatsAppMessage(phoneNumber, message) {
  const cleanPhone = cleanPhoneNumber(phoneNumber);
  if (!cleanPhone) {
    Alert.alert('Invalid Contact', 'No valid registered phone number found.');
    return false;
  }

  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

  try {
    const supported = await Linking.canOpenURL(url);
    if (supported || true) {
      await Linking.openURL(url);
      return true;
    } else {
      Alert.alert('WhatsApp Not Available', 'WhatsApp is not installed on this device.');
      return false;
    }
  } catch (err) {
    console.error('Error opening WhatsApp:', err);
    Alert.alert('Error', 'Could not launch WhatsApp. Please check device settings.');
    return false;
  }
}

/**
 * Sends a standardized Fee Reminder via WhatsApp
 */
export async function sendFeeReminderWhatsApp({ parentName, studentName, pendingAmount, dueDate, phone }) {
  const formattedAmount = formatINR(pendingAmount);
  const dueInfo = dueDate ? `\nPayment Due Date: ${dueDate}` : '';

  const message = `Dear Parent (${parentName || 'Guardian'}),

This is a reminder from Rudrapur Public School regarding the pending fee of ${formattedAmount} for ${studentName}.${dueInfo}

Kindly complete the fee payment at your earliest convenience. For queries or online bank transfers, please contact the school administration office.

Thank you,
Rudrapur Public School, Deoria`;

  return openWhatsAppMessage(phone, message);
}

/**
 * Sends a standardized Salary Notification via WhatsApp
 */
export async function sendSalarySlipWhatsApp({ teacherName, month, netSalary, phone }) {
  const formattedSalary = formatINR(netSalary);

  const message = `Hello ${teacherName},

Your monthly salary for the period ${month} has been successfully calculated and processed by Rudrapur Public School.

Net Salary Credited: ${formattedSalary}

You can collect your signed physical salary slip from the administrative office or download it from the staff portal.

Thank you,
Management & Accounts Desk
Rudrapur Public School`;

  return openWhatsAppMessage(phone, message);
}

export default {
  cleanPhoneNumber,
  openWhatsAppMessage,
  sendFeeReminderWhatsApp,
  sendSalarySlipWhatsApp,
};
