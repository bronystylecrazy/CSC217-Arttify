import styled from "@emotion/styled";
import { Alert, Box, Button, Container, OutlinedInput, TextField, Typography } from "@mui/material";
import { BiSearch, BiPlusCircle } from 'react-icons/bi'

const Input = styled('input')({
    display: 'none',
});

const SitesPage = () => {
    return <Container>
        <Box sx={{ color: 'white', marginTop: '2.5rem', background: '#161f32', padding: '1.5rem', borderRadius: '.5rem' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <OutlinedInput size="small" startAdornment={<BiSearch style={{ marginRight: '1rem' }} />} sx={{ maxWidth: '350px', width: '100%' }} inputProps={{ sx: { color: 'white' } }} placeholder="Search your site.." />
                <Button variant="contained" disableElevation sx={{ marginLeft: '1rem' }} color="success">
                    <BiPlusCircle style={{ marginRight: '.5rem' }} /> Create Site
                </Button>
            </Box>
            <Box mt={4}>
                <Alert severity="info" variant="filled">
                    It seems like you do not have any websites yet. Try <a href="#">creating one</a>.
                </Alert>
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
    </Container>
};

export default SitesPage;