import RepositoryCard from "@/components/RepositoryCard";
import useAuth from "@/hooks/useAuth";
import useRepository from "@/hooks/useRepository";
import { Repository } from "@/interfaces/Repository";
import { axios } from "@/utils/api";
import { LoadingButton } from "@mui/lab";
import { Alert, Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, List, OutlinedInput, Typography } from "@mui/material";
import { useLayoutEffect, useMemo, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { GrClose } from 'react-icons/gr';
import { useNavigate } from "react-router-dom";
export type ImportRepoProps = {
    show?: boolean;
    setShow?: Function;
};

const ImportRepoComponent: React.FC<ImportRepoProps> = ({ show = false, setShow = () => { } }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { $repository, repository } = useRepository();
    const [visible, setVisible] = useState(false);
    const [chooseRepo, setRepo] = useState<Repository>(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const repositories = useMemo<Repository[]>(() => repository.repositories.filter(repo => repo.full_name.includes(search.trim())), [repository.repositories, search]);
    useLayoutEffect(() => {
        if (show) {
            setVisible(true);
        } else {
            setTimeout(() => setVisible(false), 250);
        }
    }, [show]);

    useLayoutEffect(() => {
        if (show) {
            $repository.getRepositories();
        }
    }, [show]);

    const choose = () => {
        if (chooseRepo) {
            navigate(`/builds?repo=${chooseRepo.name}&id=${chooseRepo.id}`);
            // axios.post(`/api/repo/choose`, {
            //     clone_url: chooseRepo.clone_url,
            // }).then(() => {
            //     navigate(`/projects?repo=${chooseRepo.name}&id=${chooseRepo.id}`);
            // })
        }
    };

    const close = () => {
        setRepo(null);
        setShow(false);
        navigate(`/projects`);
    }

    return <Dialog fullWidth maxWidth="sm" open={show} onClose={() => setShow(false)} scroll="paper">
        <DialogTitle>Pick up a repository</DialogTitle>
        <DialogTitle>
            <Box display="flex" justifyContent="space-between">
                <Box display="flex" alignItems="center">
                    <Avatar src={user?.profile?.avatar_url} />
                    <Typography component="h6" sx={{ marginLeft: '.5rem' }} >{user.profile.login} <span style={{ color: "#808589" }}>'s repos</span></Typography>
                </Box>
                <OutlinedInput value={search} onChange={e => setSearch(e.target.value)} startAdornment={<BiSearch style={{ marginRight: '1rem' }} />} size="small" placeholder="Search for repository..." />
            </Box>
        </DialogTitle>
        <DialogContent dividers>
            {repository.repositories.length > 0 ?
                repositories.length > 0 && <List sx={{ width: '100%' }}>
                    {repositories.map(repo => <RepositoryCard repo={chooseRepo} setRepo={setRepo} repository={repo} key={repo.id} />)}
                </List>
                : <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '25vh' }}>
                    <CircularProgress />
                </Box>
            }

            {search.trim() !== "" && repositories.length <= 0 && <Alert severity="warning" variant="filled"> There's no repository names <b>{search.trim()}</b></Alert>}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-end', padding: '1rem' }}>
            <Button sx={{ color: 'white' }} variant="text" onClick={close}> Cancel</Button>
            <LoadingButton variant="contained" disabled={chooseRepo === null} onClick={choose}>Choose {chooseRepo === null ? 'a repository' : <b style={{ marginLeft: '.25rem' }}> {chooseRepo.name}</b>}</LoadingButton>
        </DialogActions>
    </Dialog>
};

export default ImportRepoComponent;