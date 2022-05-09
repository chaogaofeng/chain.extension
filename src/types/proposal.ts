import { Vote } from "@gnchain/chain.js"

export interface TerraProposalItem {
  voter: string
  options: { option: Vote.Option; weight: string }[]
}
