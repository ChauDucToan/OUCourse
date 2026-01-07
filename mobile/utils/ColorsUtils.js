import colors from "tailwindcss/colors";

const light = {
  primary: colors.blue[600],
  tabInactive: colors.gray[400],
  tabActive: colors.gray[900],
  iconDefault: colors.slate[500],
  danger: colors.red[500],
  green: {
    100: colors.green[100],
    200: colors.green[200],
    300: colors.green[300],
    400: colors.green[400],
    500: colors.green[500],
    600: colors.green[600],
    700: colors.green[700],
    800: colors.green[800],
    900: colors.green[900],
  },

  blue: {
    100: colors.blue[100],
    500: colors.blue[500],
  },
  slate: {
    800: colors.slate[800],
    700: colors.slate[700],
    600: colors.slate[600],
    500: colors.slate[500],
    400: colors.slate[400],
    200: colors.slate[200],
    50: colors.slate[50],
  },
  gray: {
    900: colors.gray[900],
    700: colors.gray[700],
    500: colors.gray[500],
    400: colors.gray[400],
    300: colors.gray[300],
    200: colors.gray[200],
    100: colors.gray[100],
    50: colors.gray[50],
  },
  yellow: {
    400: colors.yellow[400],
    500: colors.yellow[500],
    600: colors.yellow[600],
  },
  violet: {
    400: colors.violet[400],
    500: colors.violet[500],
    600: colors.violet[600],
  },

  white: colors.white,
  black: colors.black,
  transparent: "transparent",
};

const dark = {
  primary: colors.blue[400],
  tabInactive: colors.gray[500],
  tabActive: colors.gray[100],
  iconDefault: colors.slate[300],
  danger: colors.red[400],
  blue: {
    100: colors.blue[800],
    500: colors.blue[300],
  },
  green: {
    100: colors.green[900],
    200: colors.green[800],
    300: colors.green[700],
    400: colors.green[600],
    500: colors.green[500],
    600: colors.green[400],
    700: colors.green[300],
    800: colors.green[200],
    900: colors.green[100],
  },
  gray: {
    900: colors.gray[50],
    700: colors.gray[100],
    500: colors.gray[300],
    400: colors.gray[400],
    300: colors.gray[500],
    200: colors.gray[700],
    100: colors.gray[800],
    50: colors.gray[900],
  },
  slate: {
    800: colors.slate[100],
    700: colors.slate[200],
    600: colors.slate[300],
    500: colors.slate[400],
    400: colors.slate[500],
    200: colors.slate[700],
    50: colors.slate[900],
  },

  yellow: {
    400: colors.yellow[300],
    500: colors.yellow[400],
    600: colors.yellow[500],
  },
  violet: {
    400: colors.violet[300],
    500: colors.violet[400],
    600: colors.violet[500],
  },

  white: colors.black,
  black: colors.white,
  transparent: "transparent",
};

const AppColors = {
  light,
  dark,
};

export default AppColors;
