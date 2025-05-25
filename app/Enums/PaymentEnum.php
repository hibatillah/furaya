<?php

namespace App\Enums;

class PaymentEnum extends BaseEnum
{
    public const CASH = 'cash';
    public const BANK_TRANSFER = 'bank transfer';
    public const DEBIT_CARD = 'debit card';
    public const DIGITAL_WALLET = 'digital wallet';
    public const CREDIT_CARD = 'credit card';
    public const VOUCHER = 'voucher';
    public const DIRECT_BILLING = 'direct billing';
    public const OTHER = 'other';

    protected static array $labels = [
        'Cash' => self::CASH,
        'Bank Transfer' => self::BANK_TRANSFER,
        'Debit Card' => self::DEBIT_CARD,
        'Digital Wallet' => self::DIGITAL_WALLET,
        'Credit Card' => self::CREDIT_CARD,
        'Voucher' => self::VOUCHER,
        'Direct Billing' => self::DIRECT_BILLING,
        'Other' => self::OTHER,
    ];
}
