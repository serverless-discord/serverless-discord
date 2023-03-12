import { DiscordUser } from "../user";

export type DiscordTeam = {
    id: string;
    icon?: string;
    members: DiscordTeamMember[];
    name: string;
    owner_user_id: string;
}

export type DiscordTeamMember = {
    membership_state: DiscordTeamMembershipStates;
    permissions: string[];
    team_id: string;
    user: DiscordUser;
}

export enum DiscordTeamMembershipStates {
    INVITED = 1,
    ACCEPTED = 2,
}