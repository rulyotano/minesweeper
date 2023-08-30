import createStyles from "@material-ui/core/styles/createStyles";

export default () =>
  createStyles({
    root: {
      flexGrow: 1,
      "user-select": "none",
      "-webkit-user-select": "none",
      "-ms-user-select: none": "none"
    },
  });
