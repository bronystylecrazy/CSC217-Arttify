import useAuth from "@/hooks/useAuth";
import { Building, Repository } from "@/interfaces/Repository";
import { Avatar, Chip, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import moment from "moment";
import { useMemo } from "react";
import { BiChevronRight } from "react-icons/bi";
import { SiGithub } from "react-icons/si";

export type BuildListProps = {
    builds?: Building[];
    currentRepository: Repository;
};

const colors = {
    "success": "teal",
    "error": "#470b1b"
}

const BuildList: React.FC<BuildListProps> = ({ builds = [], currentRepository = {} }) => {

    const { user } = useAuth();

    const sortedBuilds = useMemo(() => builds.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5), [builds]);
    return <List>
        {sortedBuilds.map(build =>
            <ListItem
                key={build._id}
                sx={{ background: 'rgba(0,0,0,.1)', borderRadius: '5px', marginBottom: '.25rem' }}
                disablePadding
                // secondaryAction={<BiChevronRight style={{ transform: 'scale(1.5)', pointerEvents: 'none' }} />}
                secondaryAction={<Chip label={build.status} color="success" size="small" sx={{ width: '6rem', color: 'white', background: colors[build.status], fontWeight: '600', borderRadius: '5px', textTransform: 'capitalize' }} />}
            >
                <ListItemButton>
                    <ListItemAvatar>
                        <Avatar sx={{ background: 'rgba(0,0,0,.3)' }}>
                            {/* <ImageIcon /> */}
                            <SiGithub color="white" />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={`${currentRepository.name}@main`}
                        secondary={moment(build.created_at).fromNow()}
                    />
                </ListItemButton>
            </ListItem>
        )}
    </List>
};

export default BuildList;