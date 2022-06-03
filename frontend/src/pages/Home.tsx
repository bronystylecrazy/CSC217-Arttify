import { axios } from "@/utils/api";
import { Box, Button, Container } from "@mui/material";
import { useEffect } from "react";

const Home = () => {
    return <Container>
        <Button href="/api/auth/github/login">
            Login to Github
        </Button>
    </Container>
};

export default Home;