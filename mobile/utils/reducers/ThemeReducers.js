import AppColors from "../ColorsUtils";

export const initialThemeState = {
  mode: "light",
  colors: AppColors.light,
};
export function ThemeReducer(state, action) {
  switch (action.type) {
    case "TOGGLE_THEME": {
      const nextMode = state.mode === "light" ? "dark" : "light";
      return {
        mode: nextMode,
        colors: AppColors[nextMode],
      };
    }

    case "SET_THEME":
      return {
        mode: action.mode,
        colors: AppColors[action.mode],
      };

    default:
      return state;
  }
}
