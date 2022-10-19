import { AppDispatch } from "../app/store";
import LanguagesLink from "../features/languages/LanguagesLink";
import { setParam } from "../features/param/paramSlice";
import TimesLink from "../features/times/TimesLink";
import RndView from "./RndView";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(setParam());
  }, [dispatch]);

  return (
    <RndView>
      <TimesLink />
      <LanguagesLink />
    </RndView>
  );
};
export default App;
