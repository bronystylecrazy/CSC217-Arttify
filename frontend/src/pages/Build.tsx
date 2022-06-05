import XTerminal from "@/components/XTerminal";
import useRepository from "@/hooks/useRepository";
import useSocket, { onMessage } from "@/hooks/useSocket";
import { axios } from "@/utils/api";
import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, Card, CardActions, CardContent, CardHeader, Chip, FilledInput, Grid, IconButton, OutlinedInput, TextField, Typography } from "@mui/material";
import { Container } from "@mui/system";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BuildLogo from '@/assets/build.svg';
import { Building } from "@/interfaces/Repository";
import BuildList from "@/components/BuildList";
import { FaEye } from "react-icons/fa";


export const colors = {
    "success": "teal",
    "error": "#470b1b"
}


const BuildPage = () => {
    const [query] = useSearchParams();
    const { $repository, repository } = useRepository();
    const id = query.get("id");
    const { sendMessage } = useSocket();
    const currentRepo = useMemo(() => repository.repositories.find(repo => repo.id === +id), [id, repository.repositories])

    const [currentProject, setCurrentProject] = useState<any>(null);
    const [saveLoading, setSaveLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    const [builds, setBuilds] = useState<Building[]>([]);
    const [state, setState] = useState<"idle" | "building" | "finished" | "deployed">("idle");

    useEffect(() => {
        if (currentRepo) {
            fetchBuilds();
            fetchRepo();
        }
    }, [currentRepo]);

    const fetchBuilds = () => {
        axios.get(`/api/build/${currentRepo.id}`).then(({ data }) => {
            setBuilds(data.data || []);
            console.log(data.data);
        })
    };

    const fetchRepo = () => {
        axios.post(`/api/repo/choose`, {
            clone_url: currentRepo.clone_url,
            repo_id: currentRepo.id,
            full_name: currentRepo.full_name,
            name: currentRepo.name,
        }).then(({ data }) => {
            setCurrentProject(data.data);
            setState(data.data.status || "idle");
        });
    };

    const build = () => {
        setLoading(true);
        sendMessage(`42["build.start", ${JSON.stringify(currentProject)}]`);
    };

    onMessage("build.end", () => {
        setLoading(false);
        fetchBuilds();
    });

    const saveSetting = () => {
        if (currentRepo && currentProject) {
            setLoading(true);
            setSaveLoading(true);
            axios.post(`/api/repo/update`, { ...currentProject, repo_id: currentRepo.id })
                .then(({ data }) => {
                    console.log(data.data)
                }).finally(() => {
                    fetchRepo();
                    setSaveLoading(false);
                    setLoading(false);
                });
        }
    };

    return currentRepo && <Container>
        <Box sx={{ marginTop: '2.5rem' }}>
            {id ? <Grid container spacing={2}>
                <Grid item md={6}>
                    <Card sx={{ width: '100%', background: '#161f32', height: "100%" }} contained-text>
                        <CardContent sx={{ lineHeight: '2' }}>
                            <Typography sx={{ fontSize: '16px !important', fontWeight: 600, textTransform: 'capitalize' }}>
                                {currentRepo.name}
                            </Typography>
                            <Box sx={{ color: '#808589', fontSize: '14px', fontWeight: 500 }}>
                                Your website will be deployed on <br />
                            </Box>
                            <Typography variant="h5" component="h6" sx={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>
                                • <a href={`https://${currentRepo.name.toLowerCase()}.arttify.com`} style={{ color: '#5cebdf' }}>https://{currentRepo.name.toLowerCase()}.arttify.com</a> <Chip size="small" sx={{ background: colors[state], borderRadius: '3px', textTransform: 'capitalize' }} label={state} />
                            </Typography>
                            {/* <Box mt={2} sx={{ color: '#808589', fontSize: '12px', fontWeight: 500 }}>
                                Your last github website updated {moment(currentRepo.pushed_at).fromNow()} <br />
                            </Box> */}

                            <Typography sx={{ fontSize: '16px !important', marginTop: '1rem', fontWeight: 600 }}>
                                Build Setup
                            </Typography>
                            <Box sx={{ color: '#808589', fontSize: '14px', fontWeight: 500 }}>
                                Build Directory <br />
                                <OutlinedInput disabled={loading} value={currentProject?.build_dir} onChange={e => setCurrentProject(pro => ({ ...pro, build_dir: e.target.value }))} size="small" placeholder="dist" fullWidth />
                            </Box>
                            <Box sx={{ color: '#808589', fontSize: '14px', fontWeight: 500 }}>
                                Build Command <br />
                                <OutlinedInput disabled={loading} value={currentProject?.build_cmd} onChange={e => setCurrentProject(pro => ({ ...pro, build_cmd: e.target.value }))} startAdornment={<span style={{ marginRight: '.5rem' }}>$</span>} sx={{ marginTop: '.5rem' }} size="small" fullWidth placeholder="npm run build" />
                            </Box>
                            <Box sx={{ textAlign: 'right', color: '#808589', marginTop: '.5rem', fontSize: '12px', fontWeight: 500 }}>
                                Last updated {moment(currentProject?.updated_at).fromNow()} <br />
                            </Box>
                        </CardContent>
                        <CardActions sx={{ justifyContent: "flex-end" }}>
                            <LoadingButton loading={loading} variant="contained" sx={{ background: 'teal' }} onClick={build}>Build and Deploy</LoadingButton>
                            <LoadingButton loading={saveLoading} variant="contained" onClick={saveSetting}>Save Setting</LoadingButton>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item md={6}>
                    <Card sx={{ width: '100%', background: '#161f32', height: "100%" }} contained-text >
                        <CardContent sx={{ lineHeight: '2', display: 'flex', flexDirection: 'column', height: "100%" }}>
                            <Box display="flex" justifyContent="space-between">
                                <Box sx={{ fontSize: '16px !important', fontWeight: 600, textTransform: 'capitalize' }}>
                                    Building Logs
                                </Box>
                                <IconButton size="small"><FaEye /></IconButton>
                            </Box>
                            <Box mt={3} sx={{ flexGrow: 1, height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {builds.length <= 0 ? <Box display="flex" flexDirection="column" gap={3} justifyContent="center" alignItems="center" sx={{ width: '100%' }}>
                                    <img src={BuildLogo} style={{ width: '30%' }} />
                                    <Typography color="#808589">No building logs</Typography>
                                </Box> : <Box sx={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                                    <BuildList builds={builds} currentRepository={currentRepo} />
                                </Box>
                                }
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item md={12}>
                    <Card sx={{ width: '100%', background: '#161f32' }} contained-text id="terminal">
                        <CardHeader title="Deployment Console Logs" />
                        <CardContent>
                            <XTerminal />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
                : <Box sx={{ color: 'white', background: '#161f32', padding: '1.5rem', borderRadius: '.5rem' }}>

                </Box>}
        </Box>
    </Container>
};

export default BuildPage;