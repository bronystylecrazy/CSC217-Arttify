import { Dispatch, RootState } from "@/stores";
import { useDispatch, useSelector } from "react-redux";

const useRepository = () => {
    const repository = useSelector((state: RootState) => state.repository);
    const { repository: $repository } = useDispatch<Dispatch>();
    return { repository, $repository };
};

export default useRepository;