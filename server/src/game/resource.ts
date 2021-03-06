import { getGameState, getPlayers, setGameState } from ".";
import { io } from "../..";
import { Resource, ResourceLocation, ResourceType } from "../../types/types";
import { RESOURCE_POINT, WIN_POINTS } from "../constants";
import getRandomNumber from "../utils/getRandomNumber";

let globalResourceLocations: ResourceLocation[] = [];

export const getResourceLocations = () => [...globalResourceLocations];
export const setResourceLocations = (
  newResourceLocations: ResourceLocation[],
) => (globalResourceLocations = newResourceLocations);

let globalResources: Resource[] = [];

export const getResources = () => [...globalResources];
export const setResources = (newResources: Resource[]) =>
  (globalResources = newResources);

const getEmptyResourceLocations = () => {
  const resourceLocations = getResourceLocations();
  const resources = getResources();
  const emptyResourceLocations = [];

  for (
    let i = 0, resourceLocationsLength = resourceLocations.length;
    i < resourceLocationsLength;
    i++
  ) {
    const location = resourceLocations[i];

    const isReserved = resources.some(
      (resource) => resource.x === location.x && resource.y === location.y,
    );

    if (!isReserved) {
      emptyResourceLocations.push(location);
    }
  }

  return emptyResourceLocations;
};

const getAmountsByResourceType = () => {
  const resources = getResources();

  let basicAmount = 0;

  for (let i = 0, len = resources.length; i < len; i++) {
    const resource = resources[i];

    switch (resource.type) {
      case ResourceType.BASIC:
        basicAmount++;
        break;
    }
  }

  return {
    basicAmount,
  };
};

export const updateResourceLocations = (
  resourceLocations: ResourceLocation[],
) => {
  setResourceLocations(resourceLocations);
  addResources();
};

export const collectResource = (
  id: string,
  multiplier: number,
  playerId: string,
) => {
  const index = globalResources.findIndex((resource) => resource.id === id);
  if (index < 0) return;
  globalResources.splice(index, 1);
  const players = getPlayers();
  const pl = players.find((pl) => pl.socket.id === playerId);
  const state = getGameState();
  if (pl?.team === "coconut") {
    state.score.coconut += RESOURCE_POINT * multiplier;
  } else {
    state.score.ananas += RESOURCE_POINT * multiplier;
  }
  io.emit("updateScore", state.score);
  io.emit("updateResources", globalResources);
  if (state.score.coconut >= WIN_POINTS) {
    io.emit("teamVictory", "coconut");
    state.score.coconut = 0;
    state.score.ananas = 0;
    state.running = false;
  } else if (state.score.ananas >= WIN_POINTS) {
    io.emit("teamVictory", "ananas");
    state.score.coconut = 0;
    state.score.ananas = 0;
    state.running = false;
  }
  setGameState(state);
};

function shuffle<T>(array: T[]) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

/**
 * Add resources by given amount. If amount is not given, fills every empty resource location. Will add only as many resources as there is empty locations.
 * @param {number | undefined} amount - Number of resources to be added.
 */
export const addResources = (amount?: number) => {
  //   const { basicAmount } = getAmountsByResourceType();
  const emptyLocations = shuffle(getEmptyResourceLocations().slice());
  const emptyLocationsLength = emptyLocations.length;
  const amountToAdd =
    amount === undefined
      ? emptyLocationsLength
      : emptyLocationsLength >= amount
      ? amount
      : emptyLocationsLength;

  const resourcesToAdd = [];

  for (let i = 0, len = amountToAdd; i < len; i++) {
    const location = emptyLocations[i];

    resourcesToAdd.push({
      type: ResourceType.BASIC,
      x: location.x,
      y: location.y,
      id: location.id,
    });
  }

  const resources = getResources();
  const newResources = [...resources, ...resourcesToAdd];

  setResources(newResources);
  io.emit("updateResources", newResources);
};

export const fillEmptyResourceLocations = () => {
  const players = getPlayers();

  const resourceLocations = getResourceLocations();
  const resources = getResources();
  const diff = resourceLocations.length - resources.length;

  if (resourceLocations.length > 0) {
    addResources(getRandomNumber(1, diff));
    return;
  }

  const length = players.length;

  if (length === 0) {
    return;
  }

  const randomNumber = getRandomNumber(0, length);
  const theChosenOne = players[randomNumber];

  theChosenOne.socket.emit("giveResourceLocations");
};
