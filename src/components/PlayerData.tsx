import { PlayerDataType, Profile } from '../types/Types';
import RandomDiceSvg from './RandomDiceSvg';
import { capitalize } from '../misc/Utils';

type PlayerDataProps = {
	player: PlayerDataType;
	gameType: string;
	opponentIds?: number[];
	details?: boolean;
	users?: Profile[];
};

const PlayerData = ({
	player,
	gameType,
	opponentIds,
	details,
	users
}: PlayerDataProps) => {
	const currentUser = users?.filter(
		(playerFromPlayers) => playerFromPlayers?.profile_id === player.profile_id
	)[0];

	return (
		<div className='teamPlayerContainer'>
			<div className='teamPlayerDataRow'>
				<div
					className={`playerId  ${
						opponentIds?.includes(player.profile_id) && 'VIP'
					}`}
				>
					{player.profile_id}
				</div>
				<div
					className={`teamPlayerData flag ${player.civilization.toUpperCase()} ${
						opponentIds?.includes(player.profile_id) && 'VIP'
					}`}
				></div>
				<div
					className={`teamPlayerData name ${
						opponentIds?.includes(player.profile_id) && 'VIP'
					}`}
				>
					{currentUser ? (
						<a href={currentUser?.site_url} target='_blank'>
							{player.name}
						</a>
					) : (
						player.name
					)}
				</div>
				{!details && (
					<div
						className={`teamPlayerData rating ${
							opponentIds?.includes(player.profile_id) && 'VIP'
						}`}
					>
						{player.rating}
					</div>
				)}
				{player.civilization_randomized && (
					<div className={'teamPlayerData civRandomized'}>
						<RandomDiceSvg size={30} />
					</div>
				)}
			</div>
			{details && (
				<div className='teamPlayerDetails'>
					<div>
						<span>Win rate: </span>
						<strong>{`${
							currentUser?.modes[gameType]?.win_rate
								? currentUser?.modes[gameType]?.win_rate + '%'
								: '-'
						}`}</strong>
					</div>
					<div>
						<span>Rating: </span>
						<strong>
							{`${currentUser?.modes[gameType]?.rating || '-'} /
							${currentUser?.modes[gameType]?.max_rating || '-'}`}
						</strong>
					</div>
					<div>
						<span>Rank: </span>
						<strong>
							{`${
								capitalize(
									currentUser?.modes['rm_solo']?.rank_level.replace(/_/g, ' ')
								) || '-'
							} / 
							${
								capitalize(
									currentUser?.modes['rm_team']?.rank_level.replace(/_/g, ' ')
								) || '-'
							}`}
						</strong>
					</div>
				</div>
			)}
		</div>
	);
};

export default PlayerData;
