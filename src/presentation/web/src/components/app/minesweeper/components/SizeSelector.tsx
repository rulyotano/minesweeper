import React from "react";
import {
  gameConfigurationsCollection
} from "../helpers/gameHelper";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import { useDispatch, useSelector } from "react-redux";
import { getGameLevel, getIsGameStarted } from "../_duck/selectors";
import { initialize } from "../_duck/actions";

const SizeSelector: React.FunctionComponent<{}> = () => {
  const classes = useStyles();

  const isStarted = useSelector(getIsGameStarted);
  const currentConfig = useSelector(getGameLevel);
  const dispatch = useDispatch();
  const onChangeSelected = React.useCallback(
    (configName: string) =>
      dispatch(initialize(gameConfigurationsCollection.getConfigurationByName(configName))),
    [ dispatch ]
  );


  if (isStarted) return null;
  return <FormControl className={classes.formControl}>
    <InputLabel htmlFor="outlined-age-native-simple">Board Size</InputLabel>
    <Select
      native
      value={currentConfig.name}
      onChange={e => onChangeSelected(e.target.value as string)}
      label="Board Size"
      inputProps={{
        name: "board-size",
        id: "board-size",
      }}
    >
      {gameConfigurationsCollection.configurations.map(
        config => (<option key={config.name} value={config.name}>{config.name}</option>))}
    </Select>
  </FormControl>;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    }
  }),
);

export default React.memo(SizeSelector);