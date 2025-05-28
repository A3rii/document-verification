import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { studentProfile } from "./../app/auth/authSlice";
import { AppDispatch, RootState } from "./../app/store"; 

const useCurrentUser = () => {
  const dispatch = useDispatch<AppDispatch>(); // Type the dispatch
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);

  useEffect(() => {
    dispatch(studentProfile());
  }, [dispatch]);

  return currentUser;
};

export default useCurrentUser;
