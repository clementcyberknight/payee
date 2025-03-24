import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaThreads,
  FaTwitter,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

export const getPlatformIconByName = (
  platformName: string
): JSX.Element | null => {
  switch (platformName) {
    case "facebook": {
      return <FaFacebook size={24} className="min-w-fit" />;
    }
    case "github": {
      return <FaGithub size={24} className="min-w-fit" />;
    }
    case "instagram": {
      return <FaInstagram size={24} className="min-w-fit" />;
    }
    case "linkedin": {
      return <FaLinkedin size={24} className="min-w-fit" />;
    }
    case "threads": {
      return <FaThreads size={24} className="min-w-fit" />;
    }
    case "twitter": {
      return <FaTwitter size={24} className="min-w-fit" />;
    }
    case "youtube": {
      return <FaYoutube size={24} className="min-w-fit" />;
    }
    case "x": {
      return <FaXTwitter size={24} className="min-w-fit" />;
    }
    default:
      console.log(
        "Platform name not supported, no icon is returned:",
        platformName
      );
      return null;
  }
};

// src/lib/utils.ts

export const formatCurrency = (amount: number | string): string => {
  const numericAmount =
    typeof amount === "number"
      ? amount
      : Number.parseFloat(String(amount).replace(/[^0-9.-]+/g, ""));
  if (isNaN(numericAmount)) {
    return "Invalid Amount";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numericAmount);
};

export const formatDate = (
  timestamp: { seconds: number } | undefined
): string => {
  if (!timestamp) return "N/A";
  try {
    const date = new Date(timestamp.seconds * 1000);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};
