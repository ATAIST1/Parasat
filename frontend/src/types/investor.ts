export interface CreateInvestorProfileDto {
  fullName: string;
  about: string;
  description: string;
  city: string;
  industries: string[];
  models: string[];
  currency: string;
  investmentRange: string;
  dealCount: number;
}

export interface UpdateInvestorProfileDto {
  fullName?: string;
  about?: string;
  description?: string;
  city?: string;
  industries?: string[];
  models?: string[];
  currency?: string;
  investmentRange?: string;
  dealCount?: number;
}

export interface InvestorProfileResponseDto {
  id: string;
  userId: string;
  fullName: string;
  about: string;
  description: string;
  city: string;
  industries: string[];
  models: string[];
  currency: string;
  investmentRange: string;
  dealCount: number;
  createdAt: string;
}
