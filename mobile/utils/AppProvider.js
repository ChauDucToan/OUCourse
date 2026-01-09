import { CategoriesProvider } from "./contexts/CategoriesContext";
import { CoursesProvider } from "./contexts/CoursesContext";
import { MyColorContext } from "./contexts/MyColorContext";
import { MyUserContext } from "./contexts/MyContext";

const AppProvider = ({ children, state }) => {
  const { theme, themeDispatch, user, dispatch } = state;
  return (
    <MyColorContext.Provider value={{ theme, themeDispatch }}>
      <MyUserContext.Provider value={[user, dispatch]}>
        <CoursesProvider>
          <CategoriesProvider>{children}</CategoriesProvider>
        </CoursesProvider>
      </MyUserContext.Provider>
    </MyColorContext.Provider>
  );
};
export default AppProvider;
