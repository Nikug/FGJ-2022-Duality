import { io } from "../..";
import { Resource } from "../../types/types";

let globalResources: Resource[] = [];

export const getResources = () => [...globalResources];
export const setResources = (newResources: Resource[]) =>
  (globalResources = newResources);

export const addResources = () => {
  const resources = getResources();
  const newResource = {
    type: "",
    x: 100,
    y: 100,
  };
  const newResources = [...resources, newResource];

  setResources(newResources);
  io.emit("updateResources", newResources);
};
