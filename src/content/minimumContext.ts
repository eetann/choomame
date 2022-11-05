import { createContext } from "react";

export type MinimumContextType = {
  minimum: boolean;
  setMinimum: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultMinimumContext: MinimumContextType = {
  minimum: false,
  setMinimum: () => false,
};

export const MinimumContext = createContext<MinimumContextType>(
  defaultMinimumContext
);

