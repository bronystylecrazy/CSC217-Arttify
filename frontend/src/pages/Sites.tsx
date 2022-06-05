import useRepository from "@/hooks/useRepository";
import useSocket, { onMessage } from "@/hooks/useSocket";
import { Project } from "@/interfaces/Repository";
import { axios } from "@/utils/api";
import styled from "@emotion/styled";
import { Alert, Box, Button, Container, Menu, MenuItem, OutlinedInput, TextField, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { useLayoutEffect, useState } from "react";
import { BiSearch, BiPlusCircle } from 'react-icons/bi'
import ImportRepoComponent from "./Sites/importRepo";
import SiteList from "./Sites/SiteList";

const Input = styled('input')({
    display: 'none',
});

const SitesPage = () => {
    const { $repository } = useRepository();
    const [repoLoading, setRepoLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [importRepo, setImportRepo] = useState(false);
    const { sendMessage } = useSocket();
    const [projects, setProjects] = useState<Project[]>([]);

    onMessage('message', (message) => {
        console.log(message)
    });

    onMessage('user.auth', () => {
        const token = Cookies.get('user');
        sendMessage(`42["user.accept", "${token}"]`);
    });

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const createFromRepos = () => {
        // fetchRepo();
        setImportRepo(true);
        handleClose();
    };

    const fetchProjects = () => {
        axios.get(`/api/repo/project`)
            .then(({ data }) => {
                setProjects(data.data || []);
            });
    };

    useLayoutEffect(() => {
        $repository.sync();
        fetchProjects();
    }, [])

    return <Container>
        <Box sx={{ color: 'white', marginTop: '2.5rem', background: '#161f32', padding: '1.5rem', borderRadius: '.5rem' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <OutlinedInput size="small" startAdornment={<BiSearch style={{ marginRight: '1rem' }} />} sx={{ maxWidth: '350px', width: '100%' }} inputProps={{ sx: { color: 'white' } }} placeholder="Search your site.." />
                <Button variant="contained" onClick={handleClick} disableElevation sx={{ marginLeft: '1rem' }} color="success">
                    <BiPlusCircle style={{ marginRight: '.5rem' }} /> Create Site
                </Button>
            </Box>
            <Box mt={4}>
                {projects.length <= 0 ? <Alert severity="info" variant="filled">
                    It seems like you do not have any websites yet. Try <a href="#">creating one</a>.
                </Alert>
                    : <SiteList projects={projects} search="" />}
                <Box mt={4} sx={{ borderRadius: '.25rem', padding: '3rem', color: '#808589', fontWeight: '600', textAlign: 'center', lineHeight: '1.5', border: '2px dashed #808589' }}>
                    <Typography fontWeight={600}>Want to deploy a new site without connecting to Git?</Typography>
                    <Typography fontWeight={600}>Drag and drop your site output folder here</Typography>
                    <Box mt={2}>
                        <label htmlFor="contained-button-file" style={{ marginTop: '1.5rem' }}>
                            <Input accept="image/*" id="contained-button-file" multiple type="file" />
                            <Button variant="contained" component="span">
                                Browse to upload
                            </Button>
                        </label>
                    </Box>
                </Box>
            </Box>
        </Box>
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            <MenuItem onClick={createFromRepos}>Import repository from github.</MenuItem>
            {/* <MenuItem onClick={handleClose}>My account</MenuItem> */}
        </Menu>
        <ImportRepoComponent show={importRepo} setShow={setImportRepo} />
    </Container>
};

export default SitesPage;