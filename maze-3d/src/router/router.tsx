import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import Homepage from "@/app/homepage/homepage";
import LevelDesign from "@/app/levels/level-design";
import Editor from "@/app/editor/editor";


const rootRoute = createRootRoute()
const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <Homepage/>,
})

const GameRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/game',
    component: ()=><Editor/>,
})

const LevelDesignRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/level-design',
    component: ()=><LevelDesign/>,
})

const routeTree = rootRoute.addChildren([indexRoute,GameRoute,LevelDesignRoute])

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