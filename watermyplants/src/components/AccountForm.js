import React, { useState, useEffect } from 'react';
import { axiosWithAuth } from '../utils/axiosWithAuth';
import * as yup from 'yup';
import passwordFormSchema from '../validation/passwordFormSchema';
import phoneFormSchema from '../validation/phoneFormSchema';

//setting up default form values so that fields are empty

const initialPhoneValue = {
    phone: ""
};

const initialPasswordValues = {
    password: '',
    passwordConfirm: ''
};

//setting up default error values so that no errors appear

const initialPhoneError = {
    phone: ""
};

const initialPasswordErrors = {
    password: '',
    passwordConfirm: ''
};


//initializes that submit button as disabled
const intitialDisabledPhone = true;
const intitialDisabledPassword = true;
const intitialPhoneMessage = true;
const initialPasswordMessage = true;

export default function AccountForm(props) {
    /////  STATE  /////
    const [passwordValues, setPasswordValues] = useState(initialPasswordValues);
    const [passwordErrors, setPasswordErrors] = useState(initialPasswordErrors);
    const [phone, setPhone] = useState(localStorage.getItem('phone') || initialPhoneValue);
    const [phoneError, setPhoneError] = useState(initialPhoneError);
    const [disabledPhone, setDisabledPhone] = useState(intitialDisabledPhone);
    const [disabledPassword, setDisabledPassword] = useState(intitialDisabledPassword);
    const [hiddenPhoneMessage, setHiddenPhoneMessage] = useState(true);
    const [hiddenPasswordMessage, setHiddenPasswordMessage] = useState(true);
    const [hiddenMessage, setHiddenMessage] = useState(true)
    const [updateMessage, setUpdateMessage] = useState('')


    const formattedPhone = () => {
        return {
            phone
        };
    };

    const formattedPassword = () => {
        return {
            password: passwordValues.password.trim()
        };
    };

    const onPhoneSubmit = evt => {
        evt.preventDefault();
        axiosWithAuth()
            .put(`/api/auth/user/${localStorage.getItem('id')}`, formattedPhone())
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log('Error happend with the post request', error);
            });
        setUpdateMessage("Updated Phone")
        setHiddenMessage(false)
       
    };

    const onPasswordSubmit = evt => {
        evt.preventDefault();
        axiosWithAuth()
            .put(`/api/auth/user/${localStorage.getItem('id')}`, formattedPassword())
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log('Error happend with the post request', error);
            });

            setUpdateMessage("Updated Password")
            setHiddenMessage(false)
    };

    const onPhoneChange = evt => {
        const name = evt.target.name;
        const value = evt.target.value;

        yup //phone validation
            .reach(phoneFormSchema, name)
            .validate(value)
            .then(valid => {
                setPhoneError({
                    ...phoneError,
                    [name]: "",
                });
            })
            .catch(err => {
                setPhoneError({
                    ...phoneError,
                    [name]: err.errors[0],
                });
            });

        //state
        setPhone({
            ...phone,
            [name]: value
        });
    };

    const onPasswordChange = evt => {
        const name = evt.target.name;
        const value = evt.target.value;

        yup //password validation
            .reach(passwordFormSchema, name)
            .validate(value)
            .then(valid => {
                setPasswordErrors({
                    ...passwordErrors,
                    [name]: "",
                });
            })
            .catch(err => {
                setPasswordErrors({
                    ...passwordErrors,
                    [name]: err.errors[0],
                });

            });
        setPasswordValues({
            ...passwordValues,
            [name]: value
        });
    };

    //enables submit button once validation is met
    useEffect(() => {
        phoneFormSchema.isValid(phone).then(valid => {
            setDisabledPhone(!valid)
        })
    }, [phone])

    useEffect(() => {
        passwordFormSchema.isValid(passwordValues).then(valid => {
            setDisabledPassword(!valid)
        })
    }, [passwordValues])

    return (
        <div className='account-container'>
            <div className='card account'>
                <h2>Edit Account Information</h2>
                <div className='messages'>
                    <p className={hiddenMessage ? 'hidden-message-on' : 'hidden-message-off'}>
                        {updateMessage}
                    </p>
                    <p>{phoneError.phone}</p>

                </div>

                <form onSubmit={onPhoneSubmit} className='change-email'>
                <h3>Update Phone Number</h3>
                    <label htmlFor='phone'>
                        <input
                            placeholder="Enter phone number"
                            value={phone.phone}
                            onChange={onPhoneChange}
                            name='phone'
                        />
                    </label>
                    <button className='button' disabled={disabledPhone}>Update</button>
                </form>

                <form onSubmit={onPasswordSubmit} className='change-password'>
                <h3>Update Password</h3>
                <p>{passwordErrors.password}</p>
                    <p>{passwordErrors.passwordConfirm}</p>
                    <label htmlFor='password'>
                        <input
                            id='password'
                            name='password'
                            type='password'
                            placeholder='Enter New Password'
                            value={passwordValues.password}
                            onChange={onPasswordChange}

                        />
                    </label>
                    <label htmlFor='passwordConfirm'>
                        <input
                            id='passwordConfirm'
                            name='passwordConfirm'
                            type='password'
                            placeholder='Confirm New Password'
                            value={passwordValues.passwordConfirm}
                            onChange={onPasswordChange}
                        />
                    </label>

                    <button className='button' disabled={disabledPassword}>Update</button>

                </form>

            </div>
        </div>
    )

}

