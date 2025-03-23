import { IFAQ } from "@/types";

const siteDetails = { siteName: "payee" };
export const faqs: IFAQ[] = [
  {
    question: `Is ${siteDetails.siteName} secure?`,
    answer:
      "Absolutely. We use bank-level encryption to protect your data and never store your login information. Plus, our biometric authentication adds an extra layer of security.",
  },
  {
    question: `Can I use ${siteDetails.siteName} on multiple devices?`,
    answer:
      "Absolutely! Your Payee account syncs seamlessly across all your devices - smartphone, tablet, and computer.",
  },
  {
    question: "Can I manage payroll for all my employees?",
    answer: `Yes! ${siteDetails.siteName} supports payroll management for businesses of all sizes. Easily add and manage employees through our secure portal.`,
  },
  {
    question: "What if I need help using the app?",
    answer:
      "Our dedicated support team is available 24/7 via chat or email. Plus, we offer extensive in-app tutorials and a comprehensive knowledge base to help you make the most of Payee.",
  },
];
