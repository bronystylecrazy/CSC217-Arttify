import useAuth from '@/hooks/useAuth';
import { useState } from 'react';
import { BiNotification } from 'react-icons/bi'
import { Avatar, Box, Button, Container, Menu, MenuItem, Stack, Typography } from '@mui/material';


export type NavbarProps = {
    bordered?: boolean;
};

const Navbar: React.FC<NavbarProps> = ({ bordered = false }) => {

    const { user } = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return <Box sx={{ height: '5.5rem', width: '100%', position: 'fixed', borderBottom: bordered && '1px solid rgba(84, 84, 88, .48)' }} display="flex" alignItems="center">
        <Container>
            <Stack display="flex" direction="row" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center">
                    <img src="https://pinia.vuejs.org/logo.svg" width={48} height={48} />
                    <Typography paddingLeft={1.5} color="white" fontSize="19px" fontWeight={500} paddingTop={1}>
                        {user.profile.login} <span style={{ color: "#808589" }}>'s workspace</span>
                    </Typography>
                </Box>
                <Box display="flex" gap={2}>
                    <Button variant="contained" size="small">Create new site</Button>
                    <Avatar
                        onClick={(e) => handleClick(e as any)}
                        alt={user.profile.login}
                        src={user.profile.avatar_url}
                        sx={{
                            cursor: 'pointer',
                            border: '2px solid grey',
                            "&:hover": {
                                border: "2px solid white",
                                transition: 'all .25s ease-in-out'
                            }
                        }}
                    />
                </Box>
            </Stack>
        </Container>
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>
    </Box >;
};

export default Navbar;