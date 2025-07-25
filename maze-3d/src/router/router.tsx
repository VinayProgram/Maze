import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import  Editor from "../editor";

const rootRoute = createRootRoute()
const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <div>Hello</div>,
})

const GameRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/game',
    component: ()=><Editor/>,
})

const routeTree = rootRoute.addChildren([indexRoute,GameRoute])

declare module '@tanstack/react-router' {
    interface Register {
        routeTree: typeof routeTree
    }
}

// Set up a Router instance
const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
})

// Register things for typesafety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

export { routeTree, router }