# Ignition Pay Examples

This directory contains practical examples and reference implementations for building on the Stellar network using Ignition Pay.

## Available Examples

| Example | Language | Description |
|---------|----------|-------------|
| [dart-wallet](./dart-wallet) | Dart | Basic wallet operations - key generation, balance checking, payments |
| [flutter-demo](./flutter-demo) | Dart/Flutter | Cross-platform mobile wallet UI with Stellar integration |
| [go-exchange](./go-exchange) | Go | Exchange server with payment processing and account management |
| [go-payment-listener](./go-payment-listener) | Go | Real-time payment monitoring with Prometheus metrics |
| [python-compliance-logger](./python-compliance-logger) | Python | SEP-8 compliance and KYC/AML logging service |
| [react-demo](./react-demo) | TypeScript/React | Web-based wallet dashboard |
| [ts-backend](./ts-backend) | TypeScript | Backend services including BigInt precision auditor and withdrawal validator |
| [conformance-test-vectors](./conformance-test-vectors) | JSON | Test vectors for address validation and transaction building |

## Getting Started

Each example directory contains its own README with setup instructions. Most examples connect to the Stellar testnet and can be run with minimal configuration.

### Prerequisites

- Dart SDK 3.4+ (for Dart/Flutter examples)
- Go 1.21+ (for Go examples)
- Node.js 20+ (for TypeScript/React examples)
- Python 3.10+ (for Python examples)

### Running Examples

```bash
# Dart wallet example
cd dart-wallet/basic-wallet && dart run

# Flutter demo
cd flutter-demo && flutter run

# Go exchange
cd go-exchange && go run main.go

# TypeScript backend
cd ts-backend/stellar-api-server && npm install && npm run dev
```
