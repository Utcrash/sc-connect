interface Block {
    block_name: string;
    category: string;
    description: string;
    block_policy_template: string;
}

export const blocks: Block[] = [
    // Anticipation Category
    {
        block_name: 'Amend Anticipation',
        category: 'Anticipation',
        description: 'Modify anticipation settings',
        block_policy_template: '{"policy":"null"}',
    },
    {
        block_name: 'anticipation vault',
        category: 'Anticipation',
        description: 'Manage anticipation vault',
        block_policy_template: '{"policy":"null"}',
    },
    {
        block_name: 'DEBIT-ANTICIPATION-VAULT',
        category: 'Anticipation',
        description: 'Debit from anticipation vault',
        block_policy_template: '{"policy":"null"}',
    },
    {
        block_name: 'DELETE-DEBIT-ANTICIPATION',
        category: 'Anticipation',
        description: 'Delete debit anticipation',
        block_policy_template: '{"policy":"null"}',
    },

    // Party Category
    {
        block_name: 'Amend party',
        category: 'Party',
        description: 'Modify party details',
        block_policy_template: '{"policy":"null"}',
    },
    {
        block_name: 'Offboard party',
        category: 'Party',
        description: 'Remove party from system',
        block_policy_template: '{"policy":"null"}',
    },
    {
        block_name: 'Onboard party via XCRO',
        category: 'Party',
        description: 'Add new party via XCRO',
        block_policy_template: '{"policy":"null"}',
    },
    {
        block_name: 'Validate party',
        category: 'Party',
        description: 'Validate party information',
        block_policy_template: JSON.stringify({
            validationConfigs: [
                // ... your long validation config here ...
            ]
        }),
    },
    {
        block_name: 'Custom Amend party',
        category: 'Party',
        description: 'Custom party modification',
        block_policy_template: '{"policy":"null"}',
    },
    {
        block_name: 'Custom Offboard party',
        category: 'Party',
        description: 'Custom party offboarding',
        block_policy_template: '{"policy":"null"}',
    },
    {
        block_name: 'Custom Onboard party via XCRO',
        category: 'Party',
        description: 'Custom party onboarding via XCRO',
        block_policy_template: '{"policy":"null"}',
    },
    {
        block_name: 'ROLLBACK-PARTY',
        category: 'Party',
        description: 'Rollback party changes',
        block_policy_template: '{"policy":"null"}',
    },

    // Vault Category
    {
        block_name: 'Close Vault',
        category: 'Vault',
        description: 'Close an existing vault',
        block_policy_template: '{"policy":{"vaultClientId":"registry.Vault.vaultClientId","vaultId":"registry.Vault.debtorVaults.fundingVault.vaultIds.vaultId"}}',
    },
    {
        block_name: 'create vault',
        category: 'Vault',
        description: 'Create a new vault',
        block_policy_template: JSON.stringify({
            policy: {
                parentVaultId: "{data.vault.debtorVaults.fundingVault.parentVaultId}",
                clientId: "{data.clientId}",
                vaultNumber: "{data.platformRefNo}",
                vaultName: "{data.platformRefNo}",
                vaFields: {
                    VA: "{data.vault.debtorVaults.fundingVault.account}",
                    country: "{data.vault.debtorVaults.fundingVault.country}",
                    currency: "{data.vault.debtorVaults.fundingVault.currency}"
                },
                vaultTag: "TXN",
                limitApplied: "No",
                vaultLimit: {
                    maxTopupLimit: "",
                    minTopupLimit: "",
                    maxBalanceLimit: "",
                    minBalanceLimit: "",
                    maxDrawdownLimit: "",
                    minDrawdownLimit: "",
                    maxAllowedTxnLimit: ""
                },
                branchingAllowed: "No",
                outputKeys: {
                    vaultId: "{data.vault.debtorVaults.fundingVault.vaultIds.vaultId}"
                }
            }
        }),
    },
    {
        block_name: 'recognize vault',
        category: 'Vault',
        description: 'Recognize an existing vault',
        block_policy_template: JSON.stringify({
            policy: {
                activePolicy: "recognizeBasedOnVA",
                recognizeBasedOnVA: {
                    VA: {
                        matcherPattern: "sweepfrom [0-9]{4,}",
                        rtaAttribute: "registry.Rta.narration3"
                    },
                    vaCurrency: {
                        rtaAttribute: "registry.Rta.currency"
                    },
                    vaCountry: {
                        rtaAttribute: "registry.Rta.country"
                    }
                }
            }
        }),
    },
    {
        block_name: 'RECOGNIZE-VAULT-V2',
        category: 'Vault',
        description: 'Enhanced vault recognition',
        block_policy_template: '{"policy":"null"}',
    },
    {
        block_name: 'CUSTOM-RECOGNIZE-VAULT',
        category: 'Vault',
        description: 'Custom vault recognition',
        block_policy_template: '{"policy":"null"}',
    },
    {
        block_name: 'CUSTOM-CREATE-VAULT',
        category: 'Vault',
        description: 'Custom vault creation',
        block_policy_template: '{"policy":"null"}',
    },
    {
        block_name: 'AMEND-VAULT',
        category: 'Vault',
        description: 'Modify vault details',
        block_policy_template: '{"policy":"null"}',
    },
    {
        block_name: 'AMEND-VAULT-STATUS',
        category: 'Vault',
        description: 'Update vault status',
        block_policy_template: '{"policy":"null"}',
    },
    {
        block_name: 'DELETE-VAULT',
        category: 'Vault',
        description: 'Delete an existing vault',
        block_policy_template: '{"policy":"null"}',
    },
    {
        block_name: 'VAULT-ACCOUNT-LINK',
        category: 'Vault',
        description: 'Link account to vault',
        block_policy_template: '{"policy":"null"}',
    },
    {
        block_name: 'CUSTOM-CREATE-VAULT-RCMS',
        category: 'Vault',
        description: 'Create vault via RCMS',
        block_policy_template: '{"policy":"null"}',
    },

    // Payment Category
    {
        block_name: 'Schedule Payment',
        category: 'Payment',
        description: 'Schedule a new payment',
        block_policy_template: '{"policy":"null"}',
    },
    {
        block_name: 'PAYOUT-CALCULATOR',
        category: 'Payment',
        description: 'Calculate payout amounts',
        block_policy_template: '{"policy":"null"}',
    },
    {
        block_name: 'CUSTOM SCHEDULE PAYMENT',
        category: 'Payment',
        description: 'Custom payment scheduling',
        block_policy_template: '{"policy":"null"}',
    },

    // Recon Category
    {
        block_name: 'Create Reconcile Vault',
        category: 'Recon',
        description: 'Create reconciliation vault',
        block_policy_template: '{"policy":"null"}',
    },
    {
        block_name: 'Register Apportion',
        category: 'Recon',
        description: 'Register apportionment',
        block_policy_template: '{"policy":"null"}',
    },
    {
        block_name: 'RECONCILE-DEBIT-VAULT',
        category: 'Recon',
        description: 'Reconcile debit vault',
        block_policy_template: '{"policy":"null"}',
    },
    {
        block_name: 'RECONCILE-BLOCK-RESPONSE',
        category: 'Recon',
        description: 'Reconcile block response',
        block_policy_template: '{"policy":"null"}',
    },

    // Transaction Category
    {
        block_name: 'Create Vault Transaction',
        category: 'Transaction',
        description: 'Create new vault transaction',
        block_policy_template: '{"policy":"null"}',
    },
    {
        block_name: 'HOLD-XCRO-TRANSACTIONS',
        category: 'Transaction',
        description: 'Hold XCRO transactions',
        block_policy_template: '{"policy":"null"}',
    },

    // Other/Utility Blocks
    {
        block_name: 'End Block',
        category: 'Flow Control',
        description: 'End of flow marker',
        block_policy_template: '{"policy":"null"}',
    },
    {
        block_name: 'Success Block',
        category: 'Flow Control',
        description: 'Success marker',
        block_policy_template: '{"policy":"null"}',
    },
    {
        block_name: 'Movement Block',
        category: 'Movement',
        description: 'Handle movement operations',
        block_policy_template: JSON.stringify({
            policy: {
                vaultClientId: "Vault.vaultClientId",
                movementReference: "Transaction.platformRefId",
                fromVaultId: "Vault.debtorVaults.fundingVault.vaultIds.parentVaultId",
                toVaultId: "Vault.debtorVaults.paymentVault.vaultIds.vaultId",
                action: "TRANSFER",
                amount: "Vault.debtorVaults.paymentVault.txnInfo.amount",
                date: "Vault.debtorVaults.paymentVault.txnInfo.cutoffTime"
            }
        }),
    },
]; 