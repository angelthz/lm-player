import { Outlet, createRootRouteWithContext, } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'
import { useEffect, } from 'react'
import { logger } from 'src/utils/Logger'
// import { TimeUtils } from "@shared/utils/TimeUtils"



export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent
})


function RootComponent() {
  useEffect(() => {
    console.log("%c-> Rendering App", 'background: #1a1a1a; color: #ff00ff; font-weight:700;');
    logger.log("Hello Dev")
  })

  return (
    <main className='w-full h-screen'>
      <Outlet></Outlet>
    </main>
  )

}
