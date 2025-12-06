// frontend/src/types/investment.ts

export interface CreateInvestmentRequestDto {
  startupId: string;
  title: string;
  industry: string;
  city: string;
  description: string;

  numberOfEmployees: number;
  yearOfFoundation: number | null;
  investmentPurpose: string | null;
  revenueLastYear: number;
  profitLastYear: number;
  investmentNeeded: number;
  equityOfferedPercent: number;
}

export interface UpdateInvestmentRequestDto {
  title?: string | null;
  industry?: string | null;
  city?: string | null;
  description?: string | null;

  revenueLastYear?: number | null;
  profitLastYear?: number | null;
  investmentNeeded?: number | null;
  equityOfferedPercent?: number | null;
  numberOfEmployees?: number | null;
  yearOfFoundation?: number | null;
  investmentPurpose?: string | null;
}

export interface InvestmentRequestResponseDto {
  id: string;
  userId: string;
  startupId: string;
  title: string;
  industry: string;
  city: string;
  description: string;

  revenueLastYear: number;
  profitLastYear: number;
  investmentNeeded: number;
  equityOfferedPercent: number;
  numberOfEmployees: number;
  yearOfFoundation: number | null;
  investmentPurpose: string | null;
  createdAt: string;
}
