import express from 'express';
import { Horizon, Keypair, TransactionBuilder, Operation, Asset, Networks } from '@stellar/stellar-sdk';

const app = express();
app.use(express.json());

const server = new Horizon.Server('https://horizon-testnet.stellar.org');

interface PaymentRequest {
  destination: string;
  amount: string;
  assetCode?: string;
  assetIssuer?: string;
}

app.post('/api/payments', async (req, res) => {
  try {
    const { destination, amount, assetCode, assetIssuer } = req.body as PaymentRequest;
    const sourceKeypair = Keypair.fromSecret(process.env.STELLAR_SECRET_KEY!);
    const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

    const asset = assetCode && assetIssuer
      ? new Asset(assetCode, assetIssuer)
      : Asset.native();

    const transaction = new TransactionBuilder(sourceAccount, {
      fee: '100',
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(Operation.payment({ destination, asset, amount }))
      .setTimeout(30)
      .build();

    transaction.sign(sourceKeypair);
    const result = await server.submitTransaction(transaction);

    res.json({ success: true, hash: result.hash });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get('/api/accounts/:address', async (req, res) => {
  try {
    const account = await server.loadAccount(req.params.address);
    res.json({
      address: account.accountId(),
      balances: account.balances.map(b => ({
        type: b.asset_type,
        code: b.asset_code,
        issuer: b.asset_issuer,
        balance: b.balance,
      })),
    });
  } catch (error: any) {
    res.status(404).json({ success: false, error: 'Account not found' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API server running on port ${PORT}`));
