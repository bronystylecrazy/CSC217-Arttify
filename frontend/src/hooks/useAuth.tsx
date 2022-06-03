import { Dispatch, RootState } from "@/stores";
import { useDispatch, useSelector } from "react-redux";

const useAuth = () => {
    const user = useSelector((state: RootState) => state.user);
    const { user: $user } = useDispatch<Dispatch>();
    return { user, $user };
};

export default useAuth;