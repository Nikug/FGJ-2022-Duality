import { getPlayers } from ".";
import { io } from "../..";
import { Resource, ResourceLocation, ResourceType } from "../../types/types";
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

export const collectResource = (id: string, playerId: string) => {
  const index = globalResources.findIndex((resource) => resource.id === id);
  if (index < 0) return;
  globalResources.splice(index, 1);
  io.emit("updateResources", globalResources);
};

/**
 * Add resources by given amount. If amount is not given, fills every empty resource location. Will add only as many resources as there is empty locations.
 * @param {number | undefined} amount - Number of resources to be added.
 */
export const addResources = (amount?: number) => {
  //   const { basicAmount } = getAmountsByResourceType();
  const emptyLocations = getEmptyResourceLocations();
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
  const length = players.length;

  if (length === 0) {
    return;
  }

  const randomNumber = getRandomNumber(0, length);
  const theChosenOne = players[randomNumber];

  theChosenOne.socket.emit("giveResourceLocations");
};
