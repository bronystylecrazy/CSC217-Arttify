import useAuth from "@/hooks/useAuth";
import { Project, Repository } from "@/interfaces/Repository";
import { Avatar, Box, Chip, Typography } from "@mui/material";
import moment from "moment";
import { useMemo } from "react";
import { BiChevronRight } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { colors } from "../Build";

export type SiteListProps = {
    projects?: Project[];
    search?: string;
};

const SiteList: React.FC<SiteListProps> = ({ projects = [], search = "" }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const searchProjects = useMemo<Project[]>(() => projects.filter(p => p.full_name.includes(search.trim())), [search]);
    return <Box>
        {searchProjects.map(p =>

            <Box key={p.id}
                onClick={() => navigate(`/builds?repo=${p.name}&id=${p.id}`)}
                display="flex" justifyContent="space-between" alignItems="center"
                sx={{
                    width: '100%', padding: '2.5rem', borderRadius: '5px', background: 'rgba(0,0,0,.2)', "&:hover": {
                        // border: '1.5px solid yellow',
                        boxShadow: '0px 0px 10px rgba(255,255,0,.2)',
                        background: 'rgba(0,0,0,.3)',
                    },
                    cursor: 'pointer',
                    transition: 'all .25s ease-in-out',
                    // border: '1.5px solid rgba(0,0,0,.2)'
                    boxShadow: '0px 0px 0px rgba(0,0,0,.2)',
                }}
            >
                <Box mr={3}>
                    <Avatar src={user.profile.avatar_url} sx={{ width: '64px', height: '64px' }} />
                </Box>
                <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h6">{p.full_name} <Chip label={p.status} size="small" sx={{ background: colors[p.status], borderRadius: '5px', textTransform: 'capitalize', fontSize: '16px' }} /></Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,.6)' }}>Deploys from <a href={p.clone_url.replace('.git', '')} target="_blank" style={{ textDecoration: 'underline' }}>Github</a> ( Last updated {moment(p.updated_at).fromNow()} )</Typography>
                    </Box>
                    <Box>
                        <BiChevronRight style={{ transform: 'scale(1.8)' }} />
                    </Box>
                </Box>
            </Box>

        )}
    </Box>
};

export default SiteList;