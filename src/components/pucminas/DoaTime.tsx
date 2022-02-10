import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ApplicationState } from '../../store'
import { Container, Typography, Button, AppBar, Dialog, IconButton, Toolbar, Grid, LinearProgress, TableContainer, Table, Paper, TableBody, TableCell, TableHead, TableRow, Stack, TextField, InputAdornment, MenuItem } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { BottomUpTransition } from '../others/BottomUpTransition'
import Item from '../others/Item'
import { createSelector } from 'reselect'
import {
    actionCreators,
    blankDonation,
    DoaTimeState,
    DonateInterface,
    DonationDataInterface,
    DonationDataTopInterface,
    unloadedState as doaTimeUnloadedState,
} from '../../store/DoaTimeStore'
import { IsNullOrUndefined } from '../../helpers/GeneralUtilities'
import { DateTime } from 'luxon'
import MoneyInputField from '../inputs/MoneyInputField'

const selectDoaTimeState = createSelector<ApplicationState, DoaTimeState | undefined, DoaTimeState>(
    state => state.doaTimeState,
    dtState => dtState ?? doaTimeUnloadedState
)

export default function DoaTime() {
    const [isSendDonationModalOpen, setSendDonationModalOpen] = React.useState<boolean>(false)
    const [isSearchDonationsModalOpen, setSearchDonationsModalOpen] = React.useState<boolean>(false)
    const [searchingUsername, setSearchingUsername] = React.useState<string>('')
    const [searchingDonationCode, setSearchingDonationCode] = React.useState<string>('')
    const [currentDonation, setCurrentDonation] = React.useState<DonateInterface>(blankDonation)
    const [isLoading, setIsLoading] = React.useState<boolean>(true)
    const doaTimeState = useSelector(selectDoaTimeState)
    const dispatch = useDispatch()

    const closeSendDonationModal = () => {
        setSendDonationModalOpen(false)
    }

    const openSendDonationsModal = () => {
        setSendDonationModalOpen(true)
    }

    const closeSearchDonationsModal = () => {
        setSearchDonationsModalOpen(false)
    }

    const openSearchDonationModal = () => {
        setSearchDonationsModalOpen(true)
    }

    const GetInitialDonationsData = async () => {
        try {
            dispatch(actionCreators.getDonationSummary())
            dispatch(actionCreators.getTopDonations())
        } catch (ex: any) {
            dispatch({ type: 'ERROR', errorMessage: `Error getting initial donations data: ${ex.message}` })
        } finally {
            setIsLoading(false)
        }
    }

    React.useEffect(() => {
        GetInitialDonationsData()
    }, [])

    if (isLoading) {
        return <LinearProgress color="secondary" />
    }

    const sendDonationModal = (
        <Dialog fullScreen open={isSendDonationModalOpen} onClose={closeSendDonationModal} TransitionComponent={BottomUpTransition}>
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={closeSendDonationModal} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Donate to charity
                    </Typography>
                    <Button autoFocus color="inherit" onClick={closeSendDonationModal}>
                    close
                    </Button>
                </Toolbar>
            </AppBar>
            <Container>
                <Stack spacing={2} sx={{ mt: 2 }}>
                    <Item>
                        <TextField
                            sx={{ m: 1 }}
                            variant="filled"
                            label="Username (optional)"
                            InputProps={{
                                onChange: elem => setCurrentDonation({ ...currentDonation, username: elem.target.value }),
                            }}
                            value={currentDonation.username}
                        />
                        <TextField
                            sx={{ m: 1 }}
                            variant="filled"
                            label="Email"
                            InputProps={{
                                onChange: elem => setCurrentDonation({ ...currentDonation, email: elem.target.value }),
                            }}
                            value={currentDonation.email}
                        />
                        <TextField
                            sx={{ m: 1 }}
                            variant="filled"
                            label="Value"
                            InputProps={{
                                inputComponent: MoneyInputField as any,
                                onChange: elem => setCurrentDonation({ ...currentDonation, amount: Number(elem.target.value) }),
                                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                            }}
                            value={currentDonation.amount.toString()}
                        />
                    </Item>
                    <Item>
                        <TextField
                            sx={{ m: 1 }}
                            variant="filled"
                            label="Credit card holder name"
                            InputProps={{
                                onChange: elem => setCurrentDonation({ ...currentDonation, card: { ...currentDonation.card, holderName: elem.target.value } }),
                            }}
                            value={currentDonation.card.holderName}
                        />
                        <TextField
                            sx={{ m: 1 }}
                            variant="filled"
                            label="Credit card number"
                            InputProps={{
                                onChange: elem => setCurrentDonation({ ...currentDonation, card: { ...currentDonation.card, number: elem.target.value } }),
                            }}
                            value={currentDonation.card.number}
                        />
                        <TextField
                            sx={{ m: 1 }}
                            variant="filled"
                            label="Credit card Validity (MM/YYYY)"
                            InputProps={{
                                onChange: elem => setCurrentDonation({ ...currentDonation, card: { ...currentDonation.card, validity: elem.target.value } }),
                            }}
                            value={currentDonation.card.validity}
                        />
                        <TextField
                            sx={{ m: 1, width: '10em' }}
                            variant="filled"
                            label="Credit card CVV"
                            InputProps={{
                                onChange: elem => setCurrentDonation({ ...currentDonation, card: { ...currentDonation.card, cvv: elem.target.value } }),
                            }}
                            value={currentDonation.card.cvv}
                        />
                        <TextField
                            sx={{ m: 1 }}
                            variant="filled"
                            label="Currency"
                            select
                            InputProps={{
                                onChange: elem => setCurrentDonation({ ...currentDonation, currency: elem.target.value }),
                            }}
                            value={currentDonation.currency}>
                            <MenuItem value={'BRL'}>Reais</MenuItem>
                            <MenuItem value={'USD'}>Dolar</MenuItem>
                            <MenuItem value={'EUR'}>Euro</MenuItem>
                        </TextField>
                    </Item>
                    <Item>
                        <TextField
                            sx={{ m: 1, width: '95%' }}
                            variant="filled"
                            label="Commentary"
                            multiline
                            rows={4}
                            InputProps={{
                                onChange: elem => setCurrentDonation({ ...currentDonation, commentary: elem.target.value }),
                            }}
                            value={currentDonation.commentary}
                        />
                    </Item>
                    <Item>
                        <Button variant="contained" color="success" onClick={async () => {
                                setIsLoading(true)
                                dispatch(actionCreators.sendDonation(currentDonation))
                                GetInitialDonationsData()
                                setSendDonationModalOpen(false)
                                setIsLoading(false)
                            }}>
                            Confirm donation
                        </Button>
                    </Item>
                </Stack>
            </Container>
        </Dialog>
    )

    const renderFoundDonationsTable = () => {
        if (IsNullOrUndefined(doaTimeState.getDonationsData) || IsNullOrUndefined(doaTimeState.getDonationsData.data) || doaTimeState.getDonationsData.data.length === 0) {
            return <></>
        }
        return (
            <TableContainer component={Paper}>
                <Table aria-label="US table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Username</TableCell>
                            <TableCell align="center">Donation code</TableCell>
                            <TableCell align="center">Value</TableCell>
                            <TableCell align="center">Commentary</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {doaTimeState.getDonationsData.data.map((donation: DonationDataInterface, i: number) => (
                            <TableRow key={`foundDonationListItem${i}`}>
                                <TableCell align="center">{donation.username}</TableCell>
                                <TableCell align="center">{donation.donationKey}</TableCell>
                                <TableCell align="center">
                                    {donation.currency} {donation.amount}
                                </TableCell>
                                <TableCell>{donation.commentary}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
    
    const searchDonationsModal = (
        <Dialog fullScreen open={isSearchDonationsModalOpen} onClose={closeSearchDonationsModal} TransitionComponent={BottomUpTransition}>
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={closeSearchDonationsModal} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Search donations
                    </Typography>
                    <Button autoFocus color="inherit" onClick={closeSearchDonationsModal}>
                        close
                    </Button>
                </Toolbar>
            </AppBar>
            <Container>
                <Stack spacing={2} sx={{ mt: 2 }}>
                    <Item>
                        <TextField
                            sx={{ m: 1 }}
                            variant="filled"
                            label="Username"
                            InputProps={{
                                onChange: elem => setSearchingUsername(elem.target.value),
                            }}
                            value={searchingUsername}
                        />
                        <TextField
                            sx={{ m: 1 }}
                            variant="filled"
                            label="Donation code"
                            InputProps={{
                                onChange: elem => setSearchingDonationCode(elem.target.value),
                            }}
                            value={searchingDonationCode}
                        />
                    </Item>
                    <Item>
                        <Button variant="contained" color="primary" onClick={async () => {
                                setIsLoading(true)
                                dispatch(actionCreators.getDonations(searchingUsername, searchingDonationCode))
                                setIsLoading(false)
                            }}>
                            Search
                        </Button>
                    </Item>
                    <Item>
                        {renderFoundDonationsTable()}
                    </Item>
                </Stack>
            </Container>
        </Dialog>
    )

    const renderTopDonationsTable = () => {
        if (IsNullOrUndefined(doaTimeState.topDonationsData) || IsNullOrUndefined(doaTimeState.topDonationsData.data) || doaTimeState.topDonationsData.data.length === 0) {
            return <></>
        }
        return (
            <TableContainer component={Paper}>
                <Table aria-label="US table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Username</TableCell>
                            <TableCell align="center">Donation time</TableCell>
                            <TableCell align="center">Value</TableCell>
                            <TableCell align="center">Commentary</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {doaTimeState.topDonationsData.data.map((donation: DonationDataTopInterface, i: number) => (
                            <TableRow key={`topDonationListItem${i}`}>
                                <TableCell align="center">{donation.username}</TableCell>
                                <TableCell align="center">{DateTime.fromISO(donation.donationTime.toString()).toFormat('dd/MM/yyyy HH:mm:ss')}</TableCell>
                                <TableCell align="center">
                                    {donation.currency} {donation.amount}
                                </TableCell>
                                <TableCell>{donation.commentary}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    return (
        <Container sx={{ px: { xs: 0 } }}>
            {isSendDonationModalOpen && sendDonationModal}
            {isSearchDonationsModalOpen && searchDonationsModal}
            <Item sx={{ mb: 2 }}>
                <Typography variant="h3" component="div" gutterBottom>
                    DoaTime
                </Typography>
            </Item>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    {doaTimeState.errorMessage && (
                        <Item>
                            <Typography variant="h3" component="div" gutterBottom>
                                {doaTimeState.errorMessage}
                            </Typography>
                        </Item>
                    )}
                    {doaTimeState.donationSentResponseData && doaTimeState.donationSentResponseData.success && (
                        <Item>
                            <Typography component="div" gutterBottom>
                                {doaTimeState.donationSentResponseData.message}
                            </Typography>
                            <Typography component="div" gutterBottom>
                                Donation Code: {doaTimeState.donationSentResponseData.donationCode}
                            </Typography>
                        </Item>
                    )}
                    {doaTimeState.donationSentResponseData && !doaTimeState.donationSentResponseData.success && (
                        <Item>
                            <Typography variant="h3" component="div" gutterBottom>
                                {doaTimeState.donationSentResponseData.message}
                            </Typography>
                        </Item>
                    )}
                    <Item>
                        <Typography variant="h4" component="div" gutterBottom>
                            {doaTimeState.donationsSummaryData && doaTimeState.donationsSummaryData?.totalDonations > 0 && <>We already got {doaTimeState.donationsSummaryData?.totalDonations} across {doaTimeState.donationsSummaryData?.count} donations. Thank you!</>}
                            {!doaTimeState.donationsSummaryData && <>Be the first to donate to us. Thank you!</>}
                        </Typography>
                    </Item>
                    <Item>
                        <Button sx={{ m: 2 }} variant="contained" color="success" onClick={openSendDonationsModal}>
                            Donate!
                        </Button>
                        <Button variant="contained" color="primary" onClick={openSearchDonationModal}>
                            Search!
                        </Button>
                    </Item>
                    <Item>
                        <Typography variant="h3" component="div" gutterBottom>
                            {doaTimeState.topDonationsData && renderTopDonationsTable()}
                        </Typography>
                    </Item>
                </Grid>
            </Grid>
        </Container>
    )
}
