import React from 'react'
import {Game, Player, Profile} from '../types/Types';
import PlayerData from './PlayerData';
import TrophySvg from './TrophySvg';
import {formatNumber} from '../misc/Utils';

type TeamContainerProps = {
	game: Game;
	teamIndex: number;
	matchedOppIds: number[];
	details?: boolean;
	users?: Profile[];
};

const TeamContainer = ({
	game,
	teamIndex,
	matchedOppIds,
	details,
	users
}: TeamContainerProps) => {
	return (
		<fieldset className={game?.teams[teamIndex][0].player.result}>
			<legend>
				{game?.teams[teamIndex][0].player.result === 'win' ? (
					<TrophySvg size={60} />
				) : (
					`${new Date(game?.started_at).toLocaleDateString('et-ET', {
						timeZone: 'Europe/Tallinn',
						year: 'numeric',
						month: '2-digit',
						day: '2-digit'
					})} ${formatNumber(new Date(game?.started_at).getHours())}:${formatNumber(new Date(
						game?.started_at
					).getMinutes())} (${game?.map}) - ${Math.floor(game?.duration / 60)}min`
				)}
			</legend>

			{game?.teams[teamIndex].map(({ player }) => (
				<PlayerData
					player={player}
					key={player.profile_id}
					opponentIds={matchedOppIds}
					details={details}
					users={users}
					gameType={game.kind}
				/>
			))}
		</fieldset>
	);
};


export default TeamContainer;
