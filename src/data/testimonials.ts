import { ITestimonial } from "@/types";
import { siteDetails } from "./siteDetails";

siteDetails.siteName = "payee";

export const testimonials: ITestimonial[] = [
  {
    name: "John Smith",
    role: "HR Manager at TechCorp",
    message: `${siteDetails.siteName} has streamlined our payroll process and made staffing management effortless. It's a game-changer for our HR department.`,
    avatar: "/images/testimonial-1.webp",
  },
  {
    name: "Jane Doe",
    role: "COO at Innovatech",
    message: `With ${siteDetails.siteName}, we have significantly reduced payroll errors and improved employee satisfaction. The platform's efficiency and reliability are unmatched.`,
    avatar: "/images/testimonial-2.webp",
  },
  {
    name: "Emily Johnson",
    role: "Finance Director at FinSolutions",
    message: `${siteDetails.siteName} offers unparalleled insights and control over our staffing and payroll operations. It's an essential tool for any business looking to optimize their HR processes.`,
    avatar: "/images/testimonial-3.webp",
  },
];
