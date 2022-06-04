import { Box, Button, Typography, Container } from "@mui/material";
import { SiGithub } from 'react-icons/si'

const LoginPage = () => {
    return <Box sx={{ height: '100vh', margin: '0px auto' }} >
        <Container sx={{ height: '100%', position: 'relative' }}>
            <Box sx={{ height: '100%' }} display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Box display="flex" flexDirection="row" alignItems="center">
                        <img src="https://pinia.vuejs.org/logo.svg" style={{ width: '25%' }} />
                        <Typography variant="h2" sx={{ marginLeft: '2.5rem', color: 'white', fontWeight: 500, marginTop: '1rem' }}>
                            <span style={{ color: 'yellow' }}>Art</span><span style={{ color: 'yellowgreen' }}>ti</span><span style={{ color: 'green' }}>fy</span>✨
                            <Typography color="white">
                                Build and deploy React, Vue, Angular
                            </Typography>
                            <Typography>
                                and more apps with ease. 😊
                            </Typography>
                        </Typography>
                    </Box>
                </Box>
                <Button variant="contained" href="/api/auth/github/login" color="secondary" sx={{ background: 'black', color: 'white' }}>
                    <SiGithub style={{ marginRight: '.5rem' }} /> Log in with Github
                </Button>
            </Box>
            <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: '1.25rem', textAlign: 'center', color: 'white' }}>
                Made with ❤️ by <b><a target="_blank" href="https://github.com/bronystylecrazy">Sirawit Pratoomsuwan</a></b>
            </Box>
        </Container>
    </Box>;
};

export default LoginPage;