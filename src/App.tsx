import { ChangeEvent, useEffect, useRef, useState } from 'react'
import './App.css'
import {Game, GamesResponse, Player, Profile, Team} from './types/Types'
import PlayerData from './components/PlayerData'
import TrophySvg from './components/TrophySvg'
import TeamContainer from './components/TeamContainer'


// 18020065 Alari
// 18020639 Priit
// 18851468 Tarmo
// 18791482 Martin
// 18332393 Aare
// 18008795 Kristen
// 21132362 Olari

function App() {
  const [users, setUsers] = useState<Profile[]>([]);
  const usersRef = useRef<Player[]>([]);
  const gamesRef = useRef<Game[]>([]);
  const gamesIdsRef = useRef<string[]>([]);
  const [games, setGames] = useState<Game[]>()
  // const [allGames, setAllGames] = useState<Game[]>()
  const [latestGame, setLatestGame] = useState<Game | null>();
  const isLatestGameSet = useRef(false)
  const [homeTeam, setHomeTeam] = useState<Team>()
  const [oppTeam, setOppTeam] = useState<Team>();
  const oppTeamRef = useRef<Team>([]);
  const oppTeamIdsRef = useRef<number[]>([]);
  const matchedOppIdsRef = useRef<number[]>([]);

  const [userId, setUserId] = useState<number>()
  
  useEffect(() => {
    const previouslySelectedUser = window.localStorage.getItem('selectedUser');
    setUserId(parseInt(previouslySelectedUser || '18020065'));
  }, [])

  useEffect(() => {
    if(userId) getGames(1);
  }, [userId])

  useEffect(() => {
    if (homeTeam?.length && oppTeam?.length && homeTeam?.length === oppTeam?.length) { 
      [...homeTeam, ...oppTeam].forEach(({player}) => {
        getUser(player.profile_id)
      })
    }
	}, [homeTeam, oppTeam]);

  const getUser = (userId:number) => { 
    fetch(`https://aoe4world.com/api/v0/players/${userId}`)
			.then((response) => response.json())
      .then((data) => {
        usersRef.current = [...usersRef.current, data]
				setUsers(usersRef.current);
			});
  }

  const getGames = (page: number, totalPages?: number) => { 
    
    fetch(`https://aoe4world.com/api/v0/players/${userId}/games?page=${page}`)
			.then((response) => response.json())
      .then((data: GamesResponse) => {
        if (!isLatestGameSet.current) {
					const onGoingGame = data?.games.filter((game) => game?.ongoing)[0];
          const lastGame = onGoingGame?.game_id
						? onGoingGame
						: data?.games[0];
					
						const isHomeTeam =
							lastGame?.teams[0].filter(
								({ player }) => player.profile_id === userId
							).length > 0;

            if (isHomeTeam) {
							setHomeTeam(lastGame?.teams[0]);
							setOppTeam(lastGame?.teams[1]);
						} else {
							oppTeamRef.current = lastGame?.teams[0];
              setHomeTeam(lastGame?.teams[1]);
							setOppTeam(lastGame?.teams[0]);
              lastGame.teams.sort((a, b) => ( -1 ));
            }
          
            setLatestGame(lastGame);
						isLatestGameSet.current = true;
						gamesIdsRef.current = [...gamesIdsRef.current, lastGame.game_id];
			
        } 
            
        const oppTeamIds = oppTeamRef.current?.map(
					({ player }) => player.profile_id
        );

        oppTeamIdsRef.current = oppTeamIds;

				data?.games.forEach((game, idx) => {
					game.teams.forEach((players) => {
						players.forEach(({ player }) => {
              if (oppTeamIds?.includes(player.profile_id)) {
                if (!gamesIdsRef.current.includes(game.game_id)) {
                  game?.teams.map((team) => {
										const isHomeTeam =
											team.filter(({ player }) => player.profile_id === userId)
												.length > 0;

                    game.teams.sort((a, b) => isHomeTeam ? -1 : 1);
  
                  });
                  matchedOppIdsRef.current = [
										...matchedOppIdsRef.current,
										player.profile_id
									];

                  gamesRef.current = [...gamesRef.current, game];
                  gamesIdsRef.current = [...gamesIdsRef.current, game.game_id];

                  setGames(gamesRef.current);
                  
								}
              }
						});
					});
				});

						// gamesRef.current = [...gamesRef.current, ...data?.games];

						if (totalPages !== page) {
							if (!totalPages) {
								totalPages = Math.ceil(data.total_count / data.per_page);
							}
							if (totalPages > page) {
								getGames(page + 1, totalPages);
							}
						}
        

      
			});
  }

  const onUserChanged = (e: ChangeEvent<HTMLSelectElement>) => {
    window.localStorage.setItem('selectedUser', e.target.value);

    setLatestGame(null);
    isLatestGameSet.current = false;
    setHomeTeam([]);
    setOppTeam([]);
    setGames([]);
    gamesRef.current = [];
    gamesIdsRef.current = [];
    oppTeamIdsRef.current = [];
    oppTeamRef.current = [];
  
    setUserId(parseInt(e.target.value));
	};

  return (
		<>
			<select className='userSelect' value={userId} onChange={onUserChanged}>
				<option value='18020065'>Alari</option>
				<option value='18020639'>Priit</option>
				<option value='18851468'>Tarmo</option>
				<option value='18791482'>Martin</option>
				<option value='18332393'>Aare</option>
				<option value='18008795'>Kristen</option>
				<option value='21132362'>Olari</option>
			</select>
			{!latestGame?.ongoing && <h1 className='latestGameTitle'>Latest game</h1>}
			{latestGame?.ongoing && (
				<h1 className='ongoingGameTitle'>ONGOING GAME</h1>
			)}

			<div className='latestGame'>
				{latestGame?.teams[0]?.length && (
					<div
						className={`teamConatiner homeTeam ${latestGame?.teams[0][0].player.result}`}
					>
						<TeamContainer
							game={latestGame}
							teamIndex={0}
							matchedOppIds={matchedOppIdsRef.current}
							details
							users={users}
						/>
					</div>
				)}
				{latestGame?.teams[1]?.length && (
					<div
						className={`teamConatiner oppTeam ${latestGame?.teams[1][0].player.result}`}
					>
						<TeamContainer
							game={latestGame}
							teamIndex={1}
							matchedOppIds={matchedOppIdsRef.current}
							details
							users={users}
						/>
					</div>
				)}
			</div>
			{games?.length ? (
				<>
					<h2>Previous games</h2>

					<div className='previousGames'>
						{games?.map((game, idx) => (
							<div key={`prev-${idx}`}>
								<div className='gameDataContainer'>
									{game.teams[0]?.length && (
										<div
											className={`teamConatiner homeTeam ${game.teams[0][0].player.result}`}
										>
											<TeamContainer
												game={game}
												teamIndex={0}
												matchedOppIds={oppTeamIdsRef.current}
											/>
										</div>
									)}
									{game.teams[1]?.length && (
										<div
											className={`teamConatiner oppTeam ${game.teams[1][0].player.result}`}
										>
											<TeamContainer
												game={game}
												teamIndex={1}
												matchedOppIds={oppTeamIdsRef.current}
											/>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				</>
			) : (
				<h1>No previous games to show</h1>
			)}

			{/* <h1>user</h1> */}
			{/* <div className='card'>{JSON.stringify(users)}</div> */}
		</>
	);
}

export default App
