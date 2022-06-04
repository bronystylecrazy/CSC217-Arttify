import { Repository } from "@/interfaces/Repository";
import { Avatar, Box, IconButton, ListItem, ListItemAvatar, ListItemButton, ListItemProps, ListItemText } from "@mui/material";
import moment from 'moment'
import { BiChevronRight } from "react-icons/bi";
import { SiGithub } from "react-icons/si";

export type RepositoryCardProps = {
    repository: Repository;
    setRepo: Function;
    repo?: Repository;
} & Partial<ListItemProps>;

const RepositoryCard: React.FC<RepositoryCardProps> = ({ repo = null, setRepo = () => { }, repository, ...rest }) => {

    const isSelected = repo != null && (repo?.id === repository.id);

    return <ListItem sx={{ background: isSelected && '#0288d1' }} disablePadding secondaryAction={<BiChevronRight style={{ transform: 'scale(1.5)', pointerEvents: 'none' }} />} {...rest} >
        <ListItemButton onClick={() => setRepo(repository)}>
            <ListItemAvatar>
                <Avatar sx={{ background: isSelected && 'rgba(0,0,0,.1)' }}>
                    {/* <ImageIcon /> */}
                    <SiGithub color="white" />
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={repository.full_name} secondary={moment(repository.pushed_at).fromNow()} />
        </ListItemButton>
    </ListItem>
};

export default RepositoryCard;