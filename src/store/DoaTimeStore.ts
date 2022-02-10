import { Action, Reducer } from 'redux';
import { HTTP } from '../helpers/HTTP';
import { AppThunkAction } from '.';
import { DateTime } from 'luxon';
import { IsNullOrUndefined, IsStringNullOrWhitespace } from '../helpers/GeneralUtilities';

export const donateUrl: string = 'https://prod-04.brazilsouth.logic.azure.com:443/workflows/9bdce92f804f438ebf52d2f67c4eeb11/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=4Teixtyq_FHjF-R03z5yA7c2SAHXFwNRd0GwLz5IQXE';

//&username=Metraton
//&donationKey=f6a389bcf6736a455e62c7fb3a385a21e6f7dc38af06b5f26c3879e78fd94a45
export const getDonationUrl: string = 'https://prod-13.brazilsouth.logic.azure.com:443/workflows/e6e80ed8cd794ea2a9f68661d857540e/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=iivg9lKZFT6f8FrxXZ5cfHb5temDjLUJnznNQD-O9Ys';

//&donationKey=f6a389bcf6736a455e62c7fb3a385a21e6f7dc38af06b5f26c3879e78fd94a45
export const getDonationStatusUrl: string = 'https://prod-11.brazilsouth.logic.azure.com:443/workflows/faab3a9c8381470a8599649e202d9c8b/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=dRvewP_t7Eb0YqM2R_YqKGtG5ANd7C1inAMIeanVRl4';
export const getdonationSummaryUrl: string = 'https://prod-01.brazilsouth.logic.azure.com:443/workflows/4b5df72e06b441f18e41015425d8f583/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=q1BCQ44kvrIvzOWza_3aOzfUbh14fz6tHfkt4fiqWjI';
export const getTopDonationsUrl: string = 'https://prod-17.brazilsouth.logic.azure.com:443/workflows/1c832251f766485bbe4e62f95e4c47d0/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=e-DmRraeGH-Fr6I3_nFt2JZYo--swzF4FpjSZurVWLo';

export interface DonateInterface {
    amount: number,
    donationTime: DateTime,
    card: {
        holderName: string,
        validity: string,
        number: string,
        cvv: string
    },
    currency: string,
    email: string,
    username: string,
    commentary: string
}

export interface DonationDataInterface {
    amount: number,
    commentary?: string,
    currency?: string,
    donationKey: string,
    username: string
}

export interface DonationDataTopInterface {
    amount: number,
    commentary?: string,
    currency?: string,
    donationTime: DateTime,
    username: string
}

export interface GetDonationsInterface {
    data: DonationDataInterface[],
    quantity: number
}

export interface DonationStatusInterface {
    donationKey: string,
    status: string,
}

export interface DonationsSummaryInterface {
    totalDonations: number,
    count: number
}

export interface GetTopDonationsInterface {
    data: DonationDataTopInterface[],
    quantity: number
}

export interface DonationSentResponseInterface {
    donationCode: string,
    message: string,
    success: boolean
  }

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface DoaTimeState {
    url: string;
    errorMessage?: string;
    donationKeyToSearch: string;
    usernameToSearch: string;
    donation: DonateInterface;
    donationSentResponseData?: DonationSentResponseInterface;
    getDonationsData?: GetDonationsInterface;
    donationStatusData?: DonationStatusInterface;
    donationsSummaryData?: DonationsSummaryInterface;
    topDonationsData?: GetTopDonationsInterface;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface DonationSentAction {
    type: 'DONATION_SENT';
    response: DonationSentResponseInterface;
}

interface GetDonationsAction {
    type: 'GET_DONATIONS';
    response: GetDonationsInterface;
}

interface GetDonationStatusAction {
    type: 'GET_DONATION_STATUS';
    response: DonationStatusInterface;
}

interface GetDonationsSummaryAction {
    type: 'GET_DONATIONS_SUMMARY';
    response: DonationsSummaryInterface;
}

interface GetTopDonationsAction {
    type: 'GET_TOP_DONATIONS';
    response: GetTopDonationsInterface;
}

interface ErrorAction {
    type: 'ERROR';
    errorMessage: string | undefined;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = DonationSentAction | GetDonationsAction | GetDonationStatusAction | GetDonationsSummaryAction | GetTopDonationsAction | ErrorAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    sendDonation: (donation: DonateInterface): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        try {
            if (IsNullOrUndefined(donation)) {
                dispatch({ type: 'ERROR', errorMessage: 'Donationmust be provided.' });
                return;
            }
            const response = await HTTP.PostData<DonationSentResponseInterface>(donateUrl, donation);
            if (IsNullOrUndefined(response))
                dispatch({ type: 'ERROR', errorMessage: 'Unable to send donation. Please try again.' });
            else
                dispatch({ type: 'DONATION_SENT', response });
        }
        catch (ex: any) {
            dispatch({ type: 'ERROR', errorMessage: `Error sending donation: ${ex.message}` });
        }
    },
    getDonations: (username?: string, donationKey?: string): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        if (IsStringNullOrWhitespace(username) && IsStringNullOrWhitespace(donationKey)) {
            dispatch({ type: 'ERROR', errorMessage: 'Username or donation key must be provided.' });
            return;
        }
        try {
            let queryString = '';
            if (!IsStringNullOrWhitespace(username)) {
                queryString += `&username=${username}`
            }
            if (!IsStringNullOrWhitespace(donationKey)) {
                queryString += `&donationKey=${donationKey}`
            }
            const response = await HTTP.GetData<GetDonationsInterface>(getDonationUrl + queryString);
            if (IsNullOrUndefined(response))
                dispatch({ type: 'ERROR', errorMessage: 'Unable to get donations. Please try again.' });
            else
                dispatch({ type: 'GET_DONATIONS', response });
        }
        catch (ex: any) {
            dispatch({ type: 'ERROR', errorMessage: `Error getting donations: ${ex.message}` });
        }
    },
    getDonationStatus: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const donationKey = getState()?.doaTimeState?.donationKeyToSearch;
        if (IsStringNullOrWhitespace(donationKey)) {
            dispatch({ type: 'ERROR', errorMessage: 'Donation key must be provided.' });
            return;
        }
        try {
            const response = await HTTP.GetData<DonationStatusInterface>(getDonationStatusUrl + `&donationKey=${donationKey}`);
            if (IsNullOrUndefined(response))
                dispatch({ type: 'ERROR', errorMessage: 'Unable to get donation status. Please try again.' });
            else
                dispatch({ type: 'GET_DONATION_STATUS', response });
        }
        catch (ex: any) {
            dispatch({ type: 'ERROR', errorMessage: `Error getting donation status: ${ex.message}` });
        }
    },
    getDonationSummary: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        try {
            const response = await HTTP.GetData<DonationsSummaryInterface>(getdonationSummaryUrl);
            if (IsNullOrUndefined(response))
                dispatch({ type: 'ERROR', errorMessage: 'Unable to get donations summary. Please try again.' });
            else
                dispatch({ type: 'GET_DONATIONS_SUMMARY', response });
        }
        catch (ex: any) {
            dispatch({ type: 'ERROR', errorMessage: `Error getting donations summary: ${ex.message}` });
        }
    },
    getTopDonations: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        try {
            const response = await HTTP.GetData<GetTopDonationsInterface>(getTopDonationsUrl);
            if (IsNullOrUndefined(response))
                dispatch({ type: 'ERROR', errorMessage: 'Unable to get top donations. Please try again.' });
            else
                dispatch({ type: 'GET_TOP_DONATIONS', response });
        }
        catch (ex: any) {
            dispatch({ type: 'ERROR', errorMessage: `Error getting top donations: ${ex.message}` });
        }
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const blankDonation: DonateInterface = {
    amount: 0,
    donationTime: DateTime.utc(),
    card: {
        holderName: 'TEST T TEST',
        validity: '03/2030',
        number: '4111111111111111',
        cvv: '737'
    },
    currency: 'BRL',
    email: '',
    username: '',
    commentary: ''
}

export const unloadedState: DoaTimeState = {
    url: '',
    errorMessage: '',
    donationKeyToSearch: '',
    usernameToSearch: '',
    donation: blankDonation,
    donationSentResponseData: {} as DonationSentResponseInterface,
    getDonationsData: {} as GetDonationsInterface,
    donationStatusData: {} as DonationStatusInterface,
    donationsSummaryData: {} as DonationsSummaryInterface,
    topDonationsData: {} as GetTopDonationsInterface
};

export const reducer: Reducer<DoaTimeState> = (state: DoaTimeState | undefined, incomingAction: Action): DoaTimeState => {
    if (IsNullOrUndefined(state)) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'DONATION_SENT':
            return {
                ...state,
                donationSentResponseData: action.response
            };
        case 'GET_DONATIONS':
            return {
                ...state,
                getDonationsData: action.response
            };
        case 'GET_DONATION_STATUS':
            return {
                ...state,
                donationStatusData: action.response
            };
        case 'GET_DONATIONS_SUMMARY':
            return {
                ...state,
                donationsSummaryData: action.response
            };
        case 'GET_TOP_DONATIONS':
            return {
                ...state,
                topDonationsData: action.response
            };
        case 'ERROR':
            return {
                ...state,
                errorMessage: action.errorMessage
            };
    }

    return state;
};
