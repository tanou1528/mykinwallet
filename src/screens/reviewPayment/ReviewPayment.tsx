import React, { useEffect, useState } from 'react';
import Template from 'src/components/pageTemplate/template';
import { MessageText } from 'src/components/messages/info';
import { H3, P, Button } from 'common/selectors';
import { ReviewPaymentStyled, GoBack, ButtonContainer, MessageTextContainer } from './style';
import PaymentInformation from 'src/components/paymentInformation/PaymentInformation';
import { Link, navigate } from 'gatsby';
import { connect } from 'react-redux';
import balanceCalculator from 'src/components/helpers/balanceCalculator';


const IndexPage = props => {
	const stepByPath = () => (props.isLedgerConnected ? 3 : 4);
	const outOfByPath = () => (props.isLedgerConnected ? 5 : 4);
	return (
		<>
			<Template hide="terms" step={3} outOf={outOfByPath()} title={{ main: 'My Kin Wallet', sub: 'Send Kin from your account' }}>
				<ApprovePayment {...props} />
			</Template>
		</>
	);
};

interface IReviewPaymentStyled {
	store: {
		errors: string[];
		blockchain: {
			publicKey: string;
			account: object;
			derviationPath: string;
			unsignedTransaction: object;
			transactionSubmitted: object;
			signedTransaction: object;
			ledgerConnected: boolean;
			secret: string;
		};
		transactionForm: {
			destinationAccount: string;
			kinAmount: string;
			memo: string;
		};
	};
	actions: {
		resetAll: Function;
		setSignTransaction: Function;
		getUnsignedTransaction: Function;
		setSignTransactionKeyPair: Function;
	};
}

const ApprovePayment: React.FunctionComponent<IReviewPaymentStyled> = ({ store, actions }) => {
	// hide the button if error disable progress
	const [transactionRegular, setTransactionRegular] = useState(true);
	// const [initial, setInitial] = useState(true);
	const [balanceAfterTransaction, setBalanceAfterTransaction] = useState(0);
	const handleApprove = () => {
		setTransactionRegular(true);
		// setInitial(false);
		const { signedTransaction, unsignedTransaction, secret, account } = store.blockchain;
		// ledger sign
		if (store.blockchain.ledgerConnected) navigate('/approve-payment');
		// keyPair sign
		else actions.setSignTransactionKeyPair({ secret, unsignedTransaction, signedTransaction });
	};
	useEffect(() => {
		if (store.blockchain.transactionSubmitted) navigate('/transaction-approved');
		if (
			store.errors[0] === 'Error: Request failed with status code 404' ||
			store.errors[0] === 'Error: Request failed with status code 400'
		) {
			// hide the approve button if false (transaction not valid)
			setTransactionRegular(false);
		}
	}, [store.blockchain.transactionSubmitted, store.errors]);

	useEffect(() => {
		if (store.blockchain.account) {
			if (store.blockchain.account.balances) {
				const balance = Number(store.blockchain.account.balances[0].balance);
				const amount = Number(store.transactionForm.kinAmount);
				const sum = balanceCalculator(balance, amount);
				setBalanceAfterTransaction(sum);
			}
		}
	}, [store.blockchain.account]);

	return (
		<ReviewPaymentStyled>
			<Link to="/transaction">
				<GoBack>{'<- Edit transaction details'}</GoBack>
			</Link>
			<H3>Review Payment</H3>
			<P>Verify the payment details to continue</P>
			{store.transactionForm.kinAmount && store.blockchain.unsignedTransaction && (
				<PaymentInformation
					network={'Public'}
					amount={store.transactionForm.kinAmount}
					publicAddress={store.transactionForm.destinationAccount}
					memo={store.transactionForm.memo}
					balance={transactionRegular && balanceAfterTransaction}
				/>
			)}
			<MessageTextContainer visible={transactionRegular}>
				<MessageText text="Once you send payment it is not possible to cancel the transaction." />
			</MessageTextContainer>
			<ButtonContainer visible={transactionRegular}>
				<Button onClick={handleApprove}>Approve</Button>
			</ButtonContainer>
		</ReviewPaymentStyled>
	);
};

const mapStateToProps = (state, props) => ({
	isLedgerConnected: state.blockchain.blockchain.ledgerConnected
});

export default connect(mapStateToProps)(IndexPage);
