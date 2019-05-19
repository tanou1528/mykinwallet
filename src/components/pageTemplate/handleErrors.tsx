import React, { useState, useEffect } from 'react';
import Alerts from 'src/components/messages/error';
import { MessageHeadAText } from 'src/components/messages/info';
import { ErrorStyle } from './style';

const ErrorsTemplate = error => {
	switch (error) {
		case 'Ledger device: UNKNOWN_ERROR (0x6804)':

		case 'Failed to sign with Ledger device: U2F TIMEOUT':
			return {
				head: `Failed to sign with your Ledger device. Session timeout.`,
				text: (
					<ErrorStyle>
						Connect your Ledger device, unlock it <br /> and open the Kin application.
					</ErrorStyle>
				)
			};
		default:
			return { head: error, text: '' };
	}
};

const ErrorsTemplateRed = error => {
	switch (error) {
		case 'Error: invalid encoded string':
			return 'Validation failed. Please check that you entered the right address.';
		case 'Error: invalid version byte. expected 144, got 48':
			return 'Validation failed. Please check that you entered the right address.';
		case 'Error: invalid checksum':
			return 'Validation failed. Please check that you entered the right address.';
		case 'Error: Request failed with status code 400':
			return 'Destination account not valid';
		case 'Error: Request failed with status code 404':
			return 'Destination account does not exist';
		case "TypeError: Cannot read property 'toString' of undefined":
			return 'Destination account not valid or empty';
		case 'Failed to sign with Ledger device: U2F TIMEOUT':
			return 'Failed to sign with your Ledger device. Session timeout.';
		case 'Error: Network Error':
			return "Your payment wasn't sent due to a network error. Please try again at a later time.";
		default:
			return error;
	}
};

const Messages = ({ path, errors }) => {
	const [errorsInfo, setErrorsInfo] = useState([]);
	const [errorsAlerts, setErrorsAlerts] = useState([]);
	useEffect(() => {
		manipulateErrors();
		manipulateErrorsRed();
	}, [errors]);

	const manipulateErrors = () => {
		setErrorsInfo(
			errors.map((sError, i) => {
				return ErrorsTemplate(sError);
			})
		);
	};

	const manipulateErrorsRed = () => {
		setErrorsAlerts(
			errors.map((sError, i) => {
				return ErrorsTemplateRed(sError);
			})
		);
	};

	return <>{path === '/' ? <MessageHeadAText errors={errorsInfo} /> : <Alerts errors={errorsAlerts} />}</>;
};

export default Messages;