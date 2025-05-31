export interface TeamMember {
  role: string;
  name?: string;
}

export interface Company {
  name: string;
  link?: string;
  members: TeamMember[];
}

export interface CreditsData {
  companies: Company[];
}
