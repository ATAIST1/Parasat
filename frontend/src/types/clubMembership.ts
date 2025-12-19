export type ClubMembershipStatus = 'Pending' | 'Approved' | 'Rejected';

export interface CreateClubMembershipApplicationDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  industry?: string | null;
  position?: string | null;
  motivation?: string | null;
}

export interface ClubMembershipApplicationResponseDto {
  id: string;
  userId: string;

  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  industry?: string | null;
  position?: string | null;
  motivation?: string | null;

  status: ClubMembershipStatus;

  createdAtUtc: string;
  decisionAtUtc?: string | null;
  decisionComment?: string | null;
}
