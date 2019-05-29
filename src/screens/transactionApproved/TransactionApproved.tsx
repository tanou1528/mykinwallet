import React, { useEffect } from 'react';
import Template from 'src/components/pageTemplate/template';
import PaymentInformation from 'src/components/paymentInformation/PaymentInformation';
import { H3, P } from 'common/selectors';
import { ApprovedPaymentStyled } from './style';
import { navigate } from 'gatsby';

const IntlNumber = number => new Intl.NumberFormat('ja-JP').format(number);

const IndexPage = props => {
	return (
		<>
			<Template hide="terms" step={5} outOf={5} title={{ main: 'My Kin Wallet', sub: 'Send Kin from your account' }}>
				<TransactionApproved {...props} />
			</Template>
		</>
	);
};

interface ITransactionApproved {
	store: {
		blockchain: {
			transactionSubmitted: object;
		};

		errors: string[];
	};
	actions: object[];
}

const TransactionApproved: React.FunctionComponent<ITransactionApproved> = ({ store, actions }) => {
	useEffect(() => {
		!store.blockchain.signedTransaction && navigate('/');
		return () => actions.resetAll();
	}, [store.blockchain.transactionSubmitted]);
	return (
		<ApprovedPaymentStyled>
			<H3>Transaction approved</H3>
			<P>Here are the details of your payment:</P>
			{store.transactionForm.kinAmount && store.blockchain.transactionSubmitted && (
				<PaymentInformation
					ledger={<Ledger ledger={store.blockchain.transactionSubmitted.ledger} />}
					amount={store.transactionForm.kinAmount}
					transaction={<Transaction transaction={store.blockchain.transactionSubmitted.hash} />}
					balance={IntlNumber(
						Number(store.blockchain.account.balances[0].balance) - (Number(store.transactionForm.kinAmount) - 0.001)
					)}
					purple="purple"
				/>
			)}
			<section>
				<P>
					Go to Kin Block Explorer to see your <Account account={store.blockchain.publicKey} />{' '}
				</P>
			</section>
		</ApprovedPaymentStyled>
	);
};
export default IndexPage;

const Transaction = ({ transaction }) => (
	<a target="__blank" href={`https://www.kin.org/blockchainInfoPage/?&dataType=test&header=Transaction&id=${transaction}`}>
		{transaction}
	</a>
);
const Ledger = ({ ledger }) => (
	<a target="__blank" href={`https://www.kin.org/blockchainInfoPage/?&dataType=test&header=Ledgers&id=${ledger}`}>
		{ledger}
	</a>
);
const Account = ({ account }) => (
	<a target="__blank" href={`https://www.kin.org/blockchainAccount/?&dataType=test&header=accountID&id=${account}`}>
		account
	</a>
);
