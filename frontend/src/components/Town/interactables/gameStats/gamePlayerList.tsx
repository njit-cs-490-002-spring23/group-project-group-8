import { Box, ListItem, OrderedList } from '@chakra-ui/react';
import React from 'react';
import { usePlayers } from '../../../../classes/TownController';
import useTownController from '../../../../hooks/useTownController';
import PlayerName from './gamePlayerName';

/**
 * Lists the current players in the town, along with the current town's name and ID
 *
 * See relevant hooks: `usePlayersInTown` and `useCoveyAppState`
 *
 */
export default function PlayersInGameList(): JSX.Element {
  const players = usePlayers();
  const { friendlyName, townID } = useTownController();
  const sorted = players.concat([]);
  sorted.sort((p1, p2) =>
    p1.userName.localeCompare(p2.userName, undefined, { numeric: true, sensitivity: 'base' }),
  );

  return (
    <Box>
      <OrderedList>
        {sorted.map(player => (
          <ListItem key={player.id} fontSize={'50px'}>
            <PlayerName player={player} />
          </ListItem>
        ))}
      </OrderedList>
    </Box>
  );
}
