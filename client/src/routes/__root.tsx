import { Outlet, createRootRouteWithContext, } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'
import { useEffect, } from 'react'
import { logger } from 'src/utils/Logger'
import PlayerProvider from 'src/player-context/PlayerProvider'
import BottomBar from 'src/components/bottom-bar/BottomBar'
import { FullscreenPlayerContextProvider } from 'src/context/FullscrenPlayerVisibility'
import { PlaylistVisibilityContextProvider } from 'src/context/PlaylistVisibilityContext'
import LeftBar from 'src/components/left-bar/LeftBar'


export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent
})


function RootComponent() {
  useEffect(() => {
    console.log("%c-> Rendering App", 'background: #1a1a1a; color: #ff00ff; font-weight:700;');
    logger.log("Hello Dev");
    document.body.style.setProperty("--active-border", `rgba(255,255,255,0.10)`)

  })

  return (
    <PlayerProvider crossOrigin={true}>
      <FullscreenPlayerContextProvider>
        <PlaylistVisibilityContextProvider>
          <div id='main' className='w-full h-auto bg-[#030303] flex'>
            <LeftBar></LeftBar>
            <div id='app-content' className='min-w-0 h-full grow pb-[150px] md:pb-[88px]' >
              <Outlet></Outlet>
            </div>
          </div>
          <BottomBar></BottomBar>
        </PlaylistVisibilityContextProvider>
      </FullscreenPlayerContextProvider>
    </PlayerProvider>
  )

}
