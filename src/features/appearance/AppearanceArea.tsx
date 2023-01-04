import type { AppDispatch, RootState } from "../../app/store";
import { LocationType } from "./appearance";
import { fetchAllAppearance, updateLocation } from "./appearanceSlice";
import { FormControl, FormLabel, Select, VStack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const AppearanceArea: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const appearance = useSelector((state: RootState) => state.appearance.bucket);

  useEffect(() => {
    dispatch(fetchAllAppearance());
  }, [dispatch]);

  return (
    <VStack align="start">
      <FormControl>
        <FormLabel htmlFor="appearanceLocation">Location</FormLabel>
        <Select
          id="appearanceLocation"
          value={appearance.location}
          onChange={(e) => {
            dispatch(updateLocation(e.target.value as LocationType));
          }}
        >
          <option value="top-right">Top right</option>
          <option value="bottom-right">Bottom right</option>
        </Select>
      </FormControl>
    </VStack>
  );
};
export default AppearanceArea;
