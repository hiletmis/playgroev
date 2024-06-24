// Description: This file contains all the descriptions used in the application.

// Bridge.tsx
export const bridgeTitle = "Bridge"
export const bridgeDescriptionLine1 = "Bridge your Ethereum to OEV Network."
export const bridgeDescriptionLine2 = "You can add funds to your wallet by using the official OEV Network bridge."

export const oevNetworkBalance = "OEV Network Balance"
export const ethereumBalance = "Ethereum Balance"

export const noBalanceTitle = "Add Funds"
export const noBalanceDescription = "You have no funds to deposit. Please add funds to your wallet."

export const bridgeButton = "OEV Network Bridge"

// Deposit.tsx
export const depositCollateralTitle = "Deposit Collateral"
export const depositCollateralDescription = "Deposit your OEV Network Ethereum to start placing bids."

export const collateralBalance = "Collateral Balance"
export const depositCollateralButton = "Deposit Collateral"

// PlaceBid.tsx

export const placeBidTitle = "Place a Bid"
export const placeBidDescription = "Places bids in anticipation of an OEV opportunity on a specific dapi."

export const selectChainAndDapiDescription = "Select Chain and DApi"
export const bidAmountDescription = "I want to bid"
export const bidConditionDescription = "for an update that satisfies the condition"

export const insufficientBalance = (chainName: string, balance: string, symbol: string) => `Insufficient balance on ${chainName} chain with ${balance} ${symbol}`
export const insufficientCollateral = "Insufficient collateral. Please deposit more collateral"

export const extendedLTE = "Less than or equal to"
export const extendedGTE = "Greater than or equal to"

export const bidPlacedTitle = "Proceed to Update dApi"
export const bidPlacedMessage = "Your bid has been placed. Please proceed to next stage"

export const placeBidButton = "Place Bid"

// AwardUpdate.tsx

export const awardUpdateTitle = "Award and Update"
export const awardUpdateDescription = "The bid has been accepted. The auctioneer will assess all bids and award the auction to the highest bidder."

export const feeDeductionTitle = (fee: string) => `If your bid is awarded, a fee of ${fee} ETH will be deducted.`

export const proceedToReportTitle = "Proceed to Report"
export const proceedToReportStage = "dAPI has been updated. Please proceed to next stage"

// Report.tsx

export const reportTitle = "Report Fullfillment"
export const reportDescription = "dAPI has been updated. Please report fullfillment."

export const collateralBalanceBeforeReport = "Collateral Balance Before Report"
export const collateralBalanceAfterReport = "Collateral Balance After Report"

export const feeDeductionRefundDefault = "Once the fullfillment is confirmed or contradicted, your collateral amount will be updated."
export const feeDeductionRefundConfirmed = (fee: string) => `Your fullfillment is confirmed, your collareral amount released and the protocol fee is charged. ${fee} ETH is returned.`
export const feeDeductionRefundContradicted = (fee: string) => `Your fullfillment is contradicted, your collareral amount is slashed and the protocol fee is refunded. ${fee} ETH is returned.`