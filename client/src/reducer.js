export default function reducer(state, { type, payload }) {
    switch (type) {
        case "LOGIN_USER":
            return {
                ...state,
                currentUser: payload
            };
        case 'IS_LOGGED_IN':
            return {
                ...state,
                isAuth: payload
            }
        case 'SIGNOUT_USER':
            return {
                ...state,
                isAuth: false,
                currentUser: null
            }
        case 'CREATE_DRAFT':
            return {
                ...state,
                draft: {
                    latitude: 0,
                    longitude: 0
                },
                currenPin: null
            }
        case 'UPDATE_DRAFT_LOCATION':
            return {
                ...state,
                draft: payload
            }
        case 'DELETE_DRAFT':
            return {
                ...state,
                draft: null
            }
        case 'GET_PINS':
            return {
                ...state,
                pins: payload
            }
        case 'CREATE_PIN':
            const newPin = payload
            const prevPins = state.pins.filter(pin => pin._id !== newPin._id);
            return {
                ...state,
                pins: [...prevPins, newPin]
            }
        case 'SET_PIN':
            return {
                ...state,
                currentPin: payload,
                draft: null
            }
        case 'DELETE_PIN':
            console.log(payload)
            const deletedPin = payload
            const filteredPins = state.pins.filter(pin => pin._id !== deletedPin._id);
            return {
                ...state,
                pins: filteredPins,
                currentPin: null
            }
        case 'CREATE_COMMENT':
            console.log(payload)
            const updatedCurrentPin = payload
            const updatedpins = state.pins.filter(pin => pin._id !== updatedCurrentPin._id);
            return {
                ...state,
                pins: updatedpins,
                currentPin: updatedCurrentPin
            }

        default:
            return state;
    }
}