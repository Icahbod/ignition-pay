import 'package:flutter/material.dart';
import 'package:stellar_flutter_sdk/stellar_flutter_sdk.dart';

void main() {
  runApp(const IgnitionPayDemo());
}

class IgnitionPayDemo extends StatelessWidget {
  const IgnitionPayDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Ignition Pay Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const WalletScreen(),
    );
  }
}

class WalletScreen extends StatefulWidget {
  const WalletScreen({super.key});

  @override
  State<WalletScreen> createState() => _WalletScreenState();
}

class _WalletScreenState extends State<WalletScreen> {
  final _addressController = TextEditingController();
  final _amountController = TextEditingController();
  String _status = 'Ready';
  Keypair? _keypair;
  final Server _server = Server('https://horizon-testnet.stellar.org');

  Future<void> _createWallet() async {
    _keypair = Keypair.random();
    await FriendBot.fundTestAccount(_keypair!.accountId);
    setState(() => _status = 'Wallet created: ${_keypair!.accountId}');
  }

  Future<void> _checkBalance() async {
    if (_keypair == null) return;
    final account = await _server.accounts.account(_keypair!.accountId);
    setState(() {
      _status = account.balances
          .map((b) => '${b.balance} ${b.assetCode ?? 'XLM'}')
          .join('\n');
    });
  }

  Future<void> _sendPayment() async {
    if (_keypair == null) return;
    final account = await _server.accounts.account(_keypair!.accountId);
    final transaction = TransactionBuilder(account)
      .addOperation(PaymentOperation(
        destination: _addressController.text,
        asset: AssetTypeNative(),
        amount: _amountController.text,
      ))
      .build();

    transaction.sign(_keypair!);
    await _server.submitTransaction(transaction);
    setState(() => _status = 'Payment sent!');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Ignition Pay Demo')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            ElevatedButton(
              onPressed: _createWallet,
              child: const Text('Create Test Wallet'),
            ),
            ElevatedButton(
              onPressed: _checkBalance,
              child: const Text('Check Balance'),
            ),
            TextField(
              controller: _addressController,
              decoration: const InputDecoration(labelText: 'Destination Address'),
            ),
            TextField(
              controller: _amountController,
              decoration: const InputDecoration(labelText: 'Amount (XLM)'),
            ),
            ElevatedButton(
              onPressed: _sendPayment,
              child: const Text('Send Payment'),
            ),
            const SizedBox(height: 20),
            Text(_status),
          ],
        ),
      ),
    );
  }
}
