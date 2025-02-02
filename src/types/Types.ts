export type GamesResponse = {
	total_count: number;
	page: number;
	per_page: number;
	count: number;
	offset: number;
	filters: {
		leaderboard: undefined | null;
		since: undefined | null;
		profile_ids: number[];
		opponent_profile_id: undefined | null;
		opponent_profile_ids: undefined | null;
	};
	games: Game[];
};
export type Game = {
	game_id: number;
	started_at: string; //'2025-01-27T21:02:40.000Z'
	updated_at: string; //'2025-01-27T23:24:52.784Z'
	duration: number;
	map: string;
	kind: string;
	leaderboard: string;
	mmr_leaderboard: string;
	season: number;
	server: string;
	patch: number;
	average_rating: number;
	average_rating_deviation: number;
	average_mmr: number;
	average_mmr_deviation: number;
	ongoing: boolean;
	just_finished: boolean;
	teams: Team[];
};

export type Team = Player[]

export type Player = {
	player: PlayerDataType;
};
export type PlayerDataType = {
	profile_id: number;
	name: string;
	country: string;
	result: string;
	civilization: string;
	civilization_randomized: boolean;
	rating: number;
	rating_diff: number;
	mmr: number;
	mmr_diff: number;
	input_type: string;
};

export type Mode = {
	rating: number;
	max_rating: number;
	max_rating_7d: number;
	max_rating_1m: number;
	rank: number;
	rank_level: string;
	streak: number;
	games_count: number;
	wins_count: number;
	losses_count: number;
	disputes_count: number;
	drops_count: number;
	last_game_at: string;
	win_rate: number;
	rating_history: {
		[key: string]: {
			rating: number;
			streak: number;
			wins_count: number;
			drops_count: number;
			disputes_count: number;
			games_count: number;
		};
	};
	season: number;
	civilizations: [];
};

export type Profile = {
	name: string;
	profile_id: number;
	steam_id: string;
	site_url: string;
	avatars: {
		small: string | null;
		medium: string | null;
		full: string | null;
	};
	country: string;
	social: null;
	modes: {
		rm_solo: Mode;
		rm_team: Mode;
		rm_2v2_elo: Mode;
		rm_3v3_elo: Mode;
		rm_4v4_elo: Mode;
		qm_2v2: Mode;
		qm_3v3: Mode;
		qm_4v4: Mode;
	};
};
