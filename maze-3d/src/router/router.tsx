import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import Homepage from "@/app/homepage/homepage";
import LevelDesign from "@/app/levels/level-design";
import Editor from "@/app/editor/editor";
import GetLevels from "@/app/levels/design-components/GetLevels";
import DesignLevel from "@/app/levels/design-components/DesignLevel";


const rootRoute = createRootRoute()
const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <Homepage/>,
})

const GameRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/game/$id',
    component: ()=><Editor/>,
})

const LevelDesignRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/level-design',
    component: ()=><LevelDesign/>,
})

const ViewLevel = createRoute({
    getParentRoute: () => rootRoute,
    path: '/design-level',
    component: ()=><DesignLevel currentStep={{"1": {mazeSize: [10, 10],"mazeName":"view-only"},activeStep:2}}/>,
})

const Levels = createRoute({
    getParentRoute: () => rootRoute,
    path: '/level',
    component: ()=><GetLevels/>,
})
const routeTree = rootRoute.addChildren([indexRoute,GameRoute,LevelDesignRoute,Levels,ViewLevel])

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