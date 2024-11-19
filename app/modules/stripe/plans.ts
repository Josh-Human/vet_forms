import type { Price } from '@prisma/client'

/**
 * Enumerates subscription plan names.
 * These are used as unique identifiers in both the database and Stripe dashboard.
 */
export const PLANS = {
  FREE: 'free',
  PRACTICE: 'practice',
  ORGANISATION: 'organisation',
} as const

export type Plan = (typeof PLANS)[keyof typeof PLANS]

/**
 * Enumerates billing intervals for subscription plans.
 */
export const INTERVALS = {
  MONTH: 'month',
  YEAR: 'year',
} as const

export type Interval = (typeof INTERVALS)[keyof typeof INTERVALS]

/**
 * Enumerates supported currencies for billing.
 */
export const CURRENCIES = {
  DEFAULT: 'gbp',
  GBP: 'gbp',
} as const

export type Currency = (typeof CURRENCIES)[keyof typeof CURRENCIES]

/**
 * Defines the structure for each subscription plan.
 *
 * Note:
 * - Running the Prisma seed will create these plans in your Stripe Dashboard and populate the database.
 * - Each plan includes pricing details for each interval and currency.
 * - Plan IDs correspond to the Stripe plan IDs for easy identification.
 * - 'name' and 'description' fields are used in Stripe Checkout and client UI.
 */
export const PRICING_PLANS = {
  [PLANS.FREE]: {
    id: PLANS.FREE,
    name: 'Free',
    description: 'Get your first 3 certificates free',
    prices: {
      [INTERVALS.MONTH]: {
        [CURRENCIES.GBP]: 0,
      },
      [INTERVALS.YEAR]: {
        [CURRENCIES.GBP]: 0,
      },
    },
  },
  [PLANS.PRACTICE]: {
    id: PLANS.PRACTICE,
    name: 'Practice',
    description: 'Add upto 5 vets and 1 nurse.',
    prices: {
      [INTERVALS.MONTH]: {
        [CURRENCIES.GBP]: 5000,
      },
      [INTERVALS.YEAR]: {
        [CURRENCIES.GBP]: 50000,
      },
    },
  },
  [PLANS.ORGANISATION]: {
    id: PLANS.ORGANISATION,
    name: 'Organisation',
    description: 'Unlimited vets and upto 3 nurses',
    prices: {
      [INTERVALS.MONTH]: {
        [CURRENCIES.GBP]: 4000,
      },
      [INTERVALS.YEAR]: {
        [CURRENCIES.GBP]: 40000,
      },
    },
  },
} satisfies PricingPlan

/**
 * A type helper defining prices for each billing interval and currency.
 */
type PriceInterval<I extends Interval = Interval, C extends Currency = Currency> = {
  [interval in I]: {
    [currency in C]: Price['amount']
  }
}

/**
 * A type helper defining the structure for subscription pricing plans.
 */
type PricingPlan<T extends Plan = Plan> = {
  [key in T]: {
    id: string
    name: string
    description: string
    prices: PriceInterval
  }
}
