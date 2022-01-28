import { getPlayers } from ".";
import { io } from "../..";
import { Resource, ResourceLocation, ResourceType } from "../../types/types";

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
};

export const addResources = (amount: number | "ainaMaksimit") => {
  const { basicAmount } = getAmountsByResourceType();
  const emptyLocations = getEmptyResourceLocations();
  const emptyLocationsLength = emptyLocations.length;
  const amountToAdd =
    amount === "ainaMaksimit"
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
    });
  }

  const resources = getResources();
  const newResources = [...resources, ...resourcesToAdd];

  setResources(newResources);
  io.emit("updateResources", newResources);
};

export const askRandomPlayerForResourceLocations = () => {
  const players = getPlayers();
  const length = players.length;

  if (length === 0) {
    return;
  }

  const theChosenOne = players[getRandomNumber(0, length)];

  theChosenOne.socket.emit("giveResourceLocations");
};
