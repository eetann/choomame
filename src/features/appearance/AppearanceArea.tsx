import type { AppDispatch, RootState } from "../../app/store";
import {
  fetchAllAppearance,
  LocationType,
  updateLocation,
} from "./appearanceSlice";
import { Box, Select, VStack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const AppearanceArea: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const appearance = useSelector((state: RootState) => state.appearance);

  useEffect(() => {
    dispatch(fetchAllAppearance());
  }, [dispatch]);

  return (
    <VStack align="start">
      <Box>
        <Select
          placeholder="Select location"
          value={appearance.appearance.location}
          onChange={(e) => {
            dispatch(updateLocation(e.target.value as LocationType));
          }}
        >
          <option value="top-right">Top right</option>
          <option value="bottom-right">Bottom right</option>
        </Select>
      </Box>
    </VStack>
  );
};
export default AppearanceArea;
