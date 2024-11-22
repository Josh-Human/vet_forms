import { Link } from '@remix-run/react'
import { Logo } from './logo'
import { ROUTE_PATH as HOME_PATH } from '#app/routes/_home+/_layout'

const QUOTES = [
  {
    quote: 'There is nothing impossible to they who will try.',
    author: 'Alexander the Great',
  },
  {
    quote: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
  },
  {
    quote: 'The best way to predict the future is to create it.',
    author: 'Peter Drucker',
  },
  {
    quote: 'The only limit to our realization of tomorrow will be our doubts of today.',
    author: 'Franklin D. Roosevelt',
  },
  {
    quote: 'The only thing we have to fear is fear itself.',
    author: 'Franklin D. Roosevelt',
  },
]

type LayoutProps = {
  element: JSX.Element
}

export default function Layout({ element }: LayoutProps) {
  const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)]
  const image = {
    background:
      'url(https://img.freepik.com/premium-vector/dog-paw-seamless-pattern-footprint-triangle-polka-dot_71328-1727.jpg?size=626&ext=jpg&ga=GA1.1.1961628963.1687461397&semt=ais)',
  }
  return (
    <div className="flex h-screen w-full">
      <div className="absolute left-1/2 top-10 mx-auto flex -translate-x-1/2 transform lg:hidden">
        <Link
          to={HOME_PATH}
          prefetch="intent"
          className="z-10 flex h-10 flex-col items-center justify-center gap-2">
          <Logo />
        </Link>
      </div>
      <div
        className="relative hidden h-full w-[50%] flex-col justify-between overflow-hidden bg-card p-10 lg:flex"
        style={image}>
        <Link
          to={HOME_PATH}
          prefetch="intent"
          className="z-10 flex h-10 w-10 items-center gap-1">
          <Logo />
        </Link>
        {/* 
        <div className="z-10 flex flex-col items-start gap-2">
          <p className="text-base font-normal text-primary">{randomQuote.quote}</p>
          <p className="text-base font-normal text-primary/60">- {randomQuote.author}</p>
        </div> */}
        <div className="absolute left-0 top-0 z-0 h-full w-full opacity-40" />
      </div>
      <div className="flex h-full w-full flex-col border-l border-primary/5 bg-card lg:w-[50%]">
        {element}
      </div>
    </div>
  )
}
