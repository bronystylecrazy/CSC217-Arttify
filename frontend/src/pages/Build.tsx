import XTerminal from "@/components/XTerminal";
import useRepository from "@/hooks/useRepository";
import useSocket from "@/hooks/useSocket";
import { axios } from "@/utils/api";
import { LoadingButton } from "@mui/lab";
import { Box, Card, CardActions, CardContent, CardHeader, Chip, Grid, Typography } from "@mui/material";
import { Container } from "@mui/system";
import moment from "moment";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const BuildPage = () => {
    const [query] = useSearchParams();
    const { $repository, repository } = useRepository();
    const id = query.get("id");
    const { sendJsonMessage } = useSocket();
    const currentRepo = useMemo(() => repository.repositories.find(repo => repo.id === +id), [id, repository.repositories])

    useEffect(() => {
        // axios.post(`/api/repo/choose`, {
        //     clone_url: query.repo,
        // });
        console.log(currentRepo);
    }, [currentRepo]);

    return currentRepo && <Container>
        <Box sx={{ marginTop: '2.5rem' }}>
            <Grid container spacing={2}>
                <Grid item md={6}>
                    <Card sx={{ width: '100%', background: '#161f32' }} contained-text>
                        <CardContent sx={{ lineHeight: '2' }}>
                            <Typography sx={{ fontSize: '16px !important', fontWeight: 600 }}>
                                {currentRepo.name}
                            </Typography>
                            <Box sx={{ color: '#808589', fontSize: '14px', fontWeight: 500 }}>
                                Your website will be deployed on <br />
                            </Box>
                            <Typography variant="h5" component="h6" sx={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>
                                • <a href="" style={{ color: '#5cebdf' }}>https://{currentRepo.name.toLowerCase()}.arttify.com</a> <Chip size="small" sx={{ borderRadius: '3px' }} label="building" />
                            </Typography>
                            <Box mt={2} sx={{ color: '#808589', fontSize: '14px', fontWeight: 500 }}>
                                Your last github website updated {moment(currentRepo.pushed_at).fromNow()} <br />
                            </Box>
                        </CardContent>
                        <CardActions sx={{ justifyContent: "flex-end" }}>
                            <LoadingButton variant="contained">Site Setting</LoadingButton>
                        </CardActions>
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
        </Box>
    </Container>
};

export default BuildPage;