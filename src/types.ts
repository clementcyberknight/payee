export interface IMenuItem {
  text: string;
  url: string;
}

export interface IBenefit {
  title: string;
  description: string;
  imageSrc: string;
  bullets: IBenefitBullet[];
}

export interface IBenefitBullet {
  title: string;
  description: string;
  icon: JSX.Element;
}

export interface IPricing {
  name: string;
  price: number | string;
  features: string[];
}

export interface IFAQ {
  question: string;
  answer: string;
}

export interface ITestimonial {
  name: string;
  role: string;
  message: string;
  avatar: string;
}

export interface IStats {
  title: string;
  icon: JSX.Element;
  description: string;
}

export interface ISocials {
  facebook?: string;
  github?: string;
  instagram?: string;
  linkedin?: string;
  threads?: string;
  twitter?: string;
  youtube?: string;
  x?: string;
  [key: string]: string | undefined;
}

export interface Transaction {
  id: string;
  timestamp: {
    seconds: number;
  };
  transactionid?: string;
  transactionHash?: string;
  amount: number;
  category: "Payroll" | "Bonus" | "Other";
  status: "Success" | "Failed" | "Pending";
  workerName?: string;
  workerId?: string;
  type?: string;
  date?: {
    seconds: number;
  };
}

export interface Stats {
  workersPercentageChange: number;
  nextPaymentDate: Date | null;
  totalPaymentsThisMonth: number;
  paymentsPercentageChange: number;
  payrollBalance: number;
}
