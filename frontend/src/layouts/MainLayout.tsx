import Navbar from "@/components/Navbar";
import useAuth from "@/hooks/useAuth";
import { Box, Button, Container } from "@mui/material";
import { useEffect, useLayoutEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const MainLayout: React.FC = ({ children }) => {
    const { user, $user } = useAuth();
    const location = useLocation();

    useLayoutEffect(() => {
        $user.fetchProfile();
    }, []);


    const pages = [{
        name: "Overview",
        path: "/"
    },
    { name: "Projects", path: "/projects" },
    { name: "Builds", path: '/builds' }];


    return <Box>
        <Navbar />
        <Box paddingTop="5.5rem">
            <Container>
                <Box display="flex" gap={2}>
                    {pages.map(page => <Link to={page.path}>
                        <Button key={page.name} sx={{ background: location.pathname === page.path && "rgba(255,255,255,.05)", fontWeight: location.pathname === page.path && 600, color: location.pathname === page.path ? 'white' : '#808589' }}>{page.name}</Button>
                    </Link>)}
                </Box>
            </Container>
            {children}
        </Box>
    </Box>;
};

export default MainLayout;