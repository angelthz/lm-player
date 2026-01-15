import { queryOptions, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'


export const Route = createFileRoute('/')({
    component: RouteComponent,
})


function RouteComponent() {
    return (
        <div className='w-full h-full flex justify-center items-center'>
            <h1>Hello World</h1>
        </div>
    )
}

