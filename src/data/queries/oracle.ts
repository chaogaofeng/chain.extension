import { Coins, Dec } from "@gnchain/chain.js"
import { useCallback, useMemo } from "react"
import { useQuery } from "react-query"
import { getAmount, sortCoins, sortDenoms } from "utils/coin"
import { toPrice } from "utils/num"
import { queryKey, RefetchOptions } from "../query"
import { useCurrency } from "../settings/Currency"
import { useLCDClient } from "./lcdClient"

export const useActiveDenoms = () => {
  return { data: ["ugnc"] }
  // const lcd = useLCDClient()
  // return useQuery(
  //   [queryKey.oracle.activeDenoms],
  //   async () => {
  //     const activeDenoms = await lcd.oracle.activeDenoms()
  //     return sortDenoms(["uluna", ...activeDenoms])
  //   },
  //   { ...RefetchOptions.INFINITY }
  // )
}

export const useExchangeRates = () => {
  return { data: new Coins() }
  // const lcd = useLCDClient()
  // return useQuery(
  //   [queryKey.oracle.exchangeRates],
  //   () => lcd.oracle.exchangeRates(),
  //   { ...RefetchOptions.DEFAULT }
  // )
}

export const useOracleParams = () => {
  // const lcd = useLCDClient()
  // return useQuery([queryKey.oracle.params], () => lcd.oracle.parameters(), {
  //   ...RefetchOptions.INFINITY,
  // })
  return {
    data: {
      vote_period: 5,
      vote_threshold: new Dec(0.5),
      reward_band: new Dec(0.12),
      reward_distribution_window: 9400000,
      whitelist: [],
      slash_fraction: new Dec(0.0001),
      slash_window: 432000,
      min_valid_per_window: new Dec(0.05),
    },
  }
}

/* helpers */
type Prices = Record<Denom, Price>
export const useMemoizedPrices = (currency: Denom) => {
  const { data: exchangeRates, ...state } = useExchangeRates()

  const prices = useMemo((): Prices | undefined => {
    if (!exchangeRates) return
    const base = toPrice(getAmount(exchangeRates, currency, "1"))

    return {
      uluna: base,
      ...sortCoins(exchangeRates, currency).reduce((acc, { amount, denom }) => {
        const price = toPrice(Number(base) / Number(amount))
        return { ...acc, [denom]: price }
      }, {}),
    }
  }, [currency, exchangeRates])

  return { data: prices, ...state }
}

export type CalcValue = (params: CoinData) => number | undefined
export const useMemoizedCalcValue = (denom?: Denom) => {
  const currency = useCurrency()
  const { data: memoizedPrices } = useMemoizedPrices(denom ?? currency)

  return useCallback<CalcValue>(
    ({ amount, denom }) => {
      if (!memoizedPrices) return
      return Number(amount) * Number(memoizedPrices[denom] ?? 0)
    },
    [memoizedPrices]
  )
}
