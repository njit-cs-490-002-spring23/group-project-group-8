import { Container } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { useInteractable, useArcadeAreaController } from '../../../classes/TownController';
import useTownController from '../../../hooks/useTownController';
import SelectGameModal from './SelectGameModal';
import ArcadeAreaInteractable from './ArcadeArea';
import ArcadeAreaController from '../../../classes/ArcadeAreaController';

const ALLOWED_DRIFT = 3;
export class MockReactPlayer extends ReactPlayer {
  render(): React.ReactNode {
    return <></>;
  }
}

/**
 * The ArcadeAreaVideo component renders a ArcadeArea's game, using the ReactPlayer component.
 * The URL property of the ReactPlayer is set to the ArcadeAreaController's game property, and the isPlaying
 * property is set, by default, to the controller's isPlaying property.
 *
 * The ArcadeAreaVideo subscribes to the ArcadeAreaController's events, and responds to
 * playbackChange events by pausing (or resuming) the game playback as appropriate. In response to
 * progressChange events, the ArcadeAreaGame component will seek the game playback to the same timecode.
 * To avoid jittering, the playback is allowed to drift by up to ALLOWED_DRIFT before seeking: the game should
 * not be seek'ed to the newTime from a progressChange event unless the difference between the current time of
 * the game playback exceeds ALLOWED_DRIFT.
 *
 * The ArcadeAreaVideo also subscribes to onProgress, onPause, onPlay, and onEnded events of the ReactPlayer.
 * In response to these events, the ViewingAreaVideo updates the ViewingAreaController's properties, and
 * uses the TownController to emit a viewing area update.
 *
 * @param props: A single property 'controller', which is the ViewingAreaController corresponding to the
 *               current viewing area.
 */
export function ArcadeAreaGame({ controller }: { controller: ArcadeAreaController }): JSX.Element {
  const [isPlaying, setPlaying] = useState<boolean>(controller.isPlaying);
  const townController = useTownController();

  const reactPlayerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    const progressListener = (newTime: number) => {
      const currentTime = reactPlayerRef.current?.getCurrentTime();
      if (currentTime !== undefined && Math.abs(currentTime - newTime) > ALLOWED_DRIFT) {
        reactPlayerRef.current?.seekTo(newTime, 'seconds');
      }
    };
    controller.addListener('progressChange', progressListener);
    controller.addListener('startChange', setPlaying);
    return () => {
      controller.removeListener('startChange', setPlaying);
      controller.removeListener('progressChange', progressListener);
    };
  }, [controller]);

  return (
    <Container className='participant-wrapper'>
      Arcade Area: {controller.id}
      <ReactPlayer
        url={controller.game}
        ref={reactPlayerRef}
        config={{
          youtube: {
            playerVars: {
              // disable skipping time via keyboard to avoid weirdness with chat, etc
              disablekb: 1,
              autoplay: 1,
              // modestbranding: 1,
            },
          },
        }}
        playing={isPlaying}
        onProgress={state => {
          if (state.playedSeconds != 0 && state.playedSeconds != controller.elapsedTimeSec) {
            controller.elapsedTimeSec = state.playedSeconds;
            townController.emitArcadeAreaUpdate(controller);
          }
        }}
        onPlay={() => {
          if (!controller.isPlaying) {
            controller.isPlaying = true;
            townController.emitArcadeAreaUpdate(controller);
          }
        }}
        onPause={() => {
          if (controller.isPlaying) {
            controller.isPlaying = false;
            townController.emitArcadeAreaUpdate(controller);
          }
        }}
        onEnded={() => {
          if (controller.isPlaying) {
            controller.isPlaying = false;
            townController.emitArcadeAreaUpdate(controller);
          }
        }}
        controls={true}
        width='100%'
        height='100%'
      />
    </Container>
  );
}

/**
 * The ArcadeArea monitors the player's interaction with a ArcadeArea on the map: displaying either
 * a popup to set the game for an arcade area, or if the game is set, a game player.
 *
 * @param props: the arcade area interactable that is being interacted with
 */
export function ArcadeArea({ arcadeArea }: { arcadeArea: ArcadeAreaInteractable }): JSX.Element {
  const townController = useTownController();
  const arcadeAreaController = useArcadeAreaController(arcadeArea.name);
  const [selectIsOpen, setSelectIsOpen] = useState(arcadeAreaController.id === undefined);
  const [arcadeAreaGameURL, setArcadeAreaGameURL] = useState(arcadeAreaController.game);
  useEffect(() => {
    const setURL = (url: string | undefined) => {
      if (!url) {
        townController.interactableEmitter.emit('endIteraction', arcadeAreaController);
      } else {
        setArcadeAreaGameURL(url);
      }
    };
    arcadeAreaController.addListener('gameChange', setURL);
    return () => {
      arcadeAreaController.removeListener('gameChange', setURL);
    };
  }, [arcadeAreaController, townController]);

  if (!arcadeAreaGameURL) {
    return (
      <SelectGameModal
        isOpen={selectIsOpen}
        close={() => {
          setSelectIsOpen(false);
          // forces game to emit "arcadeArea" event again so that
          // repoening the modal works as expected
          townController.interactEnd(arcadeArea);
        }}
        arcadeArea={arcadeArea}
      />
    );
  }
  return (
    <>
      <ArcadeAreaGame controller={arcadeAreaController} />
    </>
  );
}

/**
 * The ArcadeAreaWrapper is suitable to be *always* rendered inside of a town, and
 * will activate only if the player begins interacting with an arcade area.
 */
export default function ArcadeAreaWrapper(): JSX.Element {
  const arcadeArea = useInteractable<ArcadeAreaInteractable>('arcadeArea');
  if (arcadeArea) {
    return <ArcadeArea arcadeArea={arcadeArea} />;
  }
  return <></>;
}
