/* eslint-disable prefer-const */
import { BigInt } from '@graphprotocol/graph-ts';
import { StakedInPool, LeftPool, Harvest as HarvestEvent, LogLeaveFromPendingSSRP } from '../types/SingleSidedReinsurancePool/SingleSidedReinsurancePool'
import { Stake, Harvest, Withdraw, Transaction, WithdrawRequest } from '../types/schema'
import {convertTokenToDecimal, BI_18, ADDRESS_ZERO, ZERO_BD } from './helpers'

export function handleStakedInPool(event: StakedInPool): void {
  let transactionHash = event.transaction.hash.toHexString()
  let transaction = Transaction.load(transactionHash)
  if (transaction === null) {
    transaction = new Transaction(transactionHash)
    transaction.blockNumber = event.block.number
    transaction.timestamp = event.block.timestamp
    transaction.from = event.transaction.from.toHexString()
    transaction.stakes = []
    transaction.harvests = []
    transaction.withdraws = []
    transaction.withdrawRequests = []
  }

  let staker = event.params._staker.toHexString()
  let pool = event.params._pool.toHexString()
  let value = convertTokenToDecimal(event.params._amount, BI_18)

  let stakes = transaction.stakes
  let stake = new Stake(transactionHash.concat('-').concat(BigInt.fromI32(stakes.length).toString())) as Stake

  stake.transaction = transactionHash
  stake.blockNumber = event.block.number
  stake.timestamp = event.block.timestamp
  stake.staker = staker
  stake.pool = pool
  stake.amount = value
  stake.save()

  stakes.push(stake.id)
  transaction.stakes = stakes
  transaction.save()
}

export function handleHarvest(event: HarvestEvent): void {
  let transactionHash = event.transaction.hash.toHexString()
  let transaction = Transaction.load(transactionHash)
  if (transaction === null) {
    transaction = new Transaction(transactionHash)
    transaction.blockNumber = event.block.number
    transaction.timestamp = event.block.timestamp
    transaction.from = event.transaction.from.toHexString()
    transaction.stakes = []
    transaction.harvests = []
    transaction.withdraws = []
    transaction.withdrawRequests = []
  }

  let receviver = event.params._receiver.toHexString()
  let value = convertTokenToDecimal(event.params._amount, BI_18)

  let harvests = transaction.harvests
  let harvest = new Harvest(transactionHash.concat('-').concat(BigInt.fromI32(harvests.length).toString())) as Harvest

  harvest.transaction = transactionHash
  harvest.blockNumber = event.block.number
  harvest.timestamp = event.block.timestamp
  harvest.receiver = receviver
  harvest.amount = value
  harvest.save()

  harvests.push(harvest.id)
  transaction.harvests = harvests
  transaction.save()
}

export function handleWithdraw(event: LogLeaveFromPendingSSRP): void {
  let transactionHash = event.transaction.hash.toHexString()
  let transaction = Transaction.load(transactionHash)
  if (transaction === null) {
    transaction = new Transaction(transactionHash)
    transaction.blockNumber = event.block.number
    transaction.timestamp = event.block.timestamp
    transaction.from = event.transaction.from.toHexString()
    transaction.stakes = []
    transaction.harvests = []
    transaction.withdraws = []
    transaction.withdrawRequests = []
  }

  let user = event.params._user.toHexString()
  let value = convertTokenToDecimal(event.params._withdrawUnoAmount, BI_18)

  let withdraws = transaction.withdraws
  let withdraw = new Withdraw(transactionHash.concat('-').concat(BigInt.fromI32(withdraws.length).toString())) as Withdraw

  withdraw.transaction = transactionHash
  withdraw.blockNumber = event.block.number
  withdraw.timestamp = event.block.timestamp
  withdraw.user = user
  withdraw.unoAmount = value
  withdraw.save()

  withdraws.push(withdraw.id)
  transaction.withdraws = withdraws
  transaction.save()
}

export function handleWithdrawRequest(event: LeftPool): void {
  let transactionHash = event.transaction.hash.toHexString()
  let transaction = Transaction.load(transactionHash)
  if (transaction === null) {
    transaction = new Transaction(transactionHash)
    transaction.blockNumber = event.block.number
    transaction.timestamp = event.block.timestamp
    transaction.from = event.transaction.from.toHexString()
    transaction.stakes = []
    transaction.harvests = []
    transaction.withdraws = []
    transaction.withdrawRequests = []
  }

  let user = event.params._staker.toHexString()
  let pool = event.params._pool.toHexString()
  let value = convertTokenToDecimal(event.params._requestAmount, BI_18)

  let withdrawRequests = transaction.withdrawRequests
  let withdrawRequest = new WithdrawRequest(transactionHash.concat('-').concat(BigInt.fromI32(withdrawRequests.length).toString())) as WithdrawRequest

  withdrawRequest.transaction = transactionHash
  withdrawRequest.blockNumber = event.block.number
  withdrawRequest.timestamp = event.block.timestamp
  withdrawRequest.staker = user
  withdrawRequest.pool = pool
  withdrawRequest.requestAmount = value
  withdrawRequest.save()

  withdrawRequests.push(withdrawRequest.id)
  transaction.withdrawRequests = withdrawRequests
  transaction.save()
}
