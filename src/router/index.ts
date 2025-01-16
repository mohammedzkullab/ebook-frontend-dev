import {createRouter, createWebHistory} from 'vue-router'

// [index, create, edit]
import CalendarView from '@/views/CalendarView.vue'
import Home from '@/views/Dashboard/Home.vue'
import ProfileView from '@/views/ProfileView.vue'
import Settings from '@/views/Settings/index.vue'
import Users from '@/views/Users/index.vue'
import UsersCreate from '@/views/Users/Create/create.vue'
import UserEdit from '@/views/Users/Edit/edit.vue'
import Publishers from '@/views/Publishers/index.vue'
import PublishersCreate from '@/views/Publishers/Create/create.vue'
import PublisherEdit from '@/views/Publishers/Edit/edit.vue'
import Authors from '@/views/Authors/index.vue'
import AuthorsCreate from '@/views/Authors/Create/create.vue'
import AuthorEdit from '@/views/Authors/Edit/edit.vue'
import AdCreate from '@/views/Ads/Create/create.vue'
import AdEdit from '@/views/Ads/Edit/edit.vue'
import Ads from '@/views/Ads/index.vue'
import Keywords from '@/views/Keywords/index.vue'
import KeywordCreate from '@/views/Keywords/Create/create.vue'
import KeywordEdit from '@/views/Keywords/Edit/edit.vue'
import Currencies from '@/views/Currencies/index.vue'
import CurrencyCreate from '@/views/Currencies/Create/create.vue'
import CurrencyEdit from '@/views/Currencies/Edit/edit.vue'
import Offers from '@/views/Offers/index.vue'
import OfferCreate from '@/views/Offers/Create/create.vue'
import EditOffer from '@/views/Offers/Edit/edit.vue'
import Packages from '@/views/Packages/index.vue'
import PackageCreate from '@/views/Packages/Create/create.vue'
import PackagesEdit from '@/views/Packages/Edit/edit.vue'
import Contact from '@/views/Contact/create.vue'
import Terms from '@/views/Terms/Create/create.vue'
import Privacy from '@/views/Privacy/create.vue'
import About from '@/views/About/Create/create.vue'
import Roles from '@/views/Roles/index.vue'
import RoleCreate from '@/views/Roles/Create/create.vue'
import EditRole from '@/views/Roles/Edit/edit.vue'
import Notifications from '@/views/Notifications/index.vue'
import NotificationCreate from '@/views/Notifications/Create/create.vue'
import EditNotification from '@/views/Notifications/Edit/edit.vue'
import Codes from '@/views/Discount/index.vue'
import CodeCreate from '@/views/Discount/Create/create.vue'
import Purchase_Orders from '@/views/Orders/index.vue'
import OrderPage from '@/views/Orders/View/view.vue'
import Categories from '@/views/Categories/index.vue'
import CategoryCreate from '@/views/Categories/Create/create.vue'
import CategoryEdit from '@/views/Categories/Edit/edit.vue'
import Carts from '@/views/Carts/index.vue'
import UserCart from '@/views/Carts/View/view.vue'
import Book from '@/views/Books/index.vue'
//import ViewBooks from '@/views/Books/index.vue'
import EditBook from '@/views/Books/Edit/edit.vue'
import CreateBook from "@/views/Books/Create/create.vue";
import NotFound from '@/views/404.vue'
import Login from '@/views/Authentication/Login.vue'
import ForgotPassword from '@/views/Authentication/ForgotPassword.vue'
import Readers from '@/views/Readers/index.vue'
import ReaderPage from '@/views/Readers/View/view.vue'
import {Auth} from "@/stores/Auth";
import Marketing from "@/views/Reports/Marketing/index.vue"
import Customers from "@/views/Reports/Customers/index.vue"
import Products from "@/views/Reports/Products/index.vue"
import Sales from "@/views/Reports/Sales/index.vue"
import Statistical from "@/views/Reports/Statistical/index.vue"

const routes = [
    {
        path: '/',
        name: 'dashboard',
        component: Home,
        meta: {
            title: 'Home Dashboard',
            requiresAuth: true
        }
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: ForgotPassword,
    },
    {
        path: '/admin',
        meta: {
            title: 'Home Dashboard',
            requiresAuth: true
        },
        children: [

            {
                path: 'authors',
                children: [
                    {
                        path: '',
                        name: 'Authors.index',
                        component: Authors,
                        meta: { requiresPermission: 'view-authors' },
                    },
                    {
                        path: 'create',
                        name: 'authors.create',
                        component: AuthorsCreate,
                        meta: { requiresPermission: 'create-authors' },
                    },
                    {
                        path: ':id/edit',
                        name: 'authors.edit',
                        component: AuthorEdit,
                        props: true,
                        meta: { requiresPermission: 'update-authors' },
                    }
                ]
            },

            {
                path: 'ads',
                children: [
                    {
                        path: '',
                        name: 'Ads.index',
                        component: Ads,
                        meta: { requiresPermission: 'view-ads' },
                    },
                    {
                        path: 'create',
                        name: 'Ads.create',
                        component: AdCreate,
                        meta: { requiresPermission: 'create-ads' },
                    },
                    {
                        path: ':id/edit',
                        name: 'Ads.edit',
                        component: AdEdit,
                        props: true,
                        meta: { requiresPermission: 'update-ads' },
                    },
                ]
            },
            {
                path: 'marketing',
                name: 'marketing.index',
                component: Marketing,
            },
            {
                path: 'sales',
                name: 'sales.index',
                component: Sales,
            },
            {
                path: 'products',
                name: 'products.index',
                component: Products,
            },
            {
                path: 'customers',
                name: 'customers.index',
                component: Customers,
            },
            {
                path: 'statistical',
                name: 'statistical.index',
                component: Statistical,
            },
            {
                path: 'terms',
                children: [
                    {
                        path: 'create',
                        name: 'terms.create',
                        component: Terms,
                        meta: { requiresPermission: 'create-settings-general' },
                    }
                ]
            },
            {
                path: 'privacy',
                children: [
                    {
                        path: 'create',
                        name: 'privacy.create',
                        component: Privacy,
                        meta: { requiresPermission: 'create-settings-general' },
                    }
                ]
            },
            {
                path: 'about',
                children: [
                    {
                        path: 'create',
                        name: 'about.create',
                        component: About,
                        meta: { requiresPermission: 'create-settings-general' },
                    }
                ]
            },
            {
                path: 'contact',
                children: [

                    {
                        path: 'create',
                        name: 'Contact.create',
                        component: Contact,
                        meta: { requiresPermission: 'create-settings-general' },
                    },
                ]
            },
            {
                path: 'settings',
                children: [

                    {
                        path: 'index',
                        name: 'Settings.index',
                        component: Settings,
                    },
                ]
            },
            {
                path: 'users',
                meta: { requiresRole: 'SUPER_ADMIN' },
                children: [
                    {
                        path: '',
                        name: 'users.index',
                        component: Users,
                        meta: { requiresPermission: 'view-users' },
                    },
                    {
                        path: 'create',
                        name: 'users.create',
                        component: UsersCreate,
                        meta: { requiresPermission: 'create-users' },
                    },
                    {
                        path: ':id/edit',
                        name: 'users.edit',
                        component: UserEdit,
                        props: true,
                        meta: { requiresPermission: 'update-users' },
                    }
                ]

            },
            {
                path: 'roles',
                children: [
                    {
                        path: '',
                        name: 'roles.index',
                        component: Roles,
                    },
                    {
                        path: 'create',
                        name: 'roles.create',
                        component: RoleCreate,
                    },
                    {

                        path: ':name/edit',
                        name: 'roles.edit',
                        component: EditRole,
                        props: true
                    }
                ]

            },

            {
                path: 'readers',
                children: [
                    {
                        path: '',
                        name: 'readers.index',
                        component: Readers,
                        meta: { requiresPermission: 'view-readers' },
                    },
                    {
                        path: 'view/:id',
                        name: 'readers.view',
                        component: ReaderPage,
                        meta: { requiresPermission: 'view-readers' },
                        props: true
                    },

                ]
            },
            {
                path: 'carts',
                children: [
                    {
                        path: '',
                        name: 'carts.index',
                        component: Carts,
                    },
                    {
                        path: 'view/:id',
                        name: 'carts.view',
                        component: UserCart,
                        props: true
                    },
                ]
            },
            {
                path: 'categories',
                children: [
                    {
                        path: '',
                        name: 'categories.index',
                        component: Categories,
                        meta: { requiresPermission: 'view-categories' },
                    },
                    {
                        path: 'create',
                        name: 'categories.create',
                        component: CategoryCreate,
                        meta: { requiresPermission: 'create-categories' },
                    },
                    {
                        path: ':id/edit',
                        name: 'categories.edit',
                        component: CategoryEdit,
                        props: true,
                        meta: { requiresPermission: 'update-categories' },
                    }

                ]

            },
            {
                path: 'keywords',
                children: [
                    {
                        path: '',
                        name: 'keywords.index',
                        component: Keywords,
                    },
                    {
                        path: 'create',
                        name: 'keywords.create',
                        component: KeywordCreate,
                    },
                    {
                        path: ':id/edit',
                        name: 'keywords.edit',
                        component: KeywordEdit,
                        props: true,
                    }

                ]

            },
            {
                path: 'currencies',
                children: [
                    {
                        path: '',
                        name: 'currencies.index',
                        component: Currencies,
                    },
                    {
                        path: 'create',
                        name: 'currencies.create',
                        component: CurrencyCreate,
                    },
                    {
                        path: ':id/edit',
                        name: 'currencies.edit',
                        component: CurrencyEdit,
                        props: true,
                    }

                ]

            },
            {
                path: 'offers',
                children: [
                    {
                        path: '',
                        name: 'offers.index',
                        component: Offers,
                        meta: { requiresPermission: 'view-offers' },
                    },
                    {
                        path: 'create',
                        name: 'offers.create',
                        component: OfferCreate,
                        meta: { requiresPermission: 'create-offers' },
                    },
                    {
                        path: ':id/edit',
                        name: 'offers.edit',
                        component: EditOffer,
                        props: true,
                        meta: { requiresPermission: 'update-offers' },
                    }
                ]
            },
            {

                path: 'notifications',
                children: [
                    {
                        path: '',
                        name: 'Notifications.index',
                        component: Notifications,
                        meta: { requiresPermission: 'view-notifications' },
                    },
                    {
                        path: 'create',
                        name: 'Notifications.create',
                        component: NotificationCreate,
                        meta: { requiresPermission: 'create-notifications' },
                    },
                    {
                        path: ':id/edit',
                        name: 'Notifications.edit',
                        component: EditNotification,
                        props: true,
                        meta: { requiresPermission: 'update-notifications' },
                    }
                ]
            },
            {

                path: 'packages',
                children: [
                    {
                        path: '',
                        name: 'packages.index',
                        component: Packages,
                        meta: { requiresPermission: 'view-packages' },
                    },
                    {
                        path: 'create',
                        name: 'packages.create',
                        component: PackageCreate,
                        meta: { requiresPermission: 'create-packages' },

                    },
                    {
                        path: ':id/edit',
                        name: 'packages.edit',
                        component: PackagesEdit,
                        props: true,
                        meta: { requiresPermission: 'update-packages' },
                    }
                ]
            },
            {
                path: 'codes',
                children: [
                    {
                        path: '',
                        name: 'codes.index',
                        component: Codes,
                        meta: { requiresPermission: 'view-codes' },
                    },
                    {
                        path: 'create',
                        name: 'codes.create',
                        component: CodeCreate,
                        meta: { requiresPermission: 'create-codes' },
                    },


                ]

            },
            {
                path: 'publishers',
                children: [
                    {
                        path: '',
                        name: 'Publishers.index',
                        component: Publishers,
                        meta: { requiresPermission: 'view-publishing-houses' },
                    },
                    {
                        path: 'create',
                        name: 'Publishers.create',
                        component: PublishersCreate,
                        meta: { requiresPermission: 'create-publishing-houses' },
                    },
                    {
                        path: ':id/edit',
                        name: 'publishers.edit',
                        component: PublisherEdit,
                        props: true,
                        meta: { requiresPermission: 'update-publishing-houses' },
                    }
                ]
            },
            {
                path: 'orders',
                children: [
                    {
                        path: '',
                        name: 'Purchase-Orders.index',
                        component: Purchase_Orders,
                        meta: { requiresPermission: 'view-purchase-orders' },
                    },
                    {
                        path: ':id/view',
                        name: 'orders.view',
                        component: OrderPage,
                        meta: { requiresPermission: 'view-purchase-orders' },
                        props: true,
                    },

                ]
            },
            {
                path: 'books',
                children: [
                    {
                        path: '',
                        name: 'books.index',
                        component: Book,
                        meta: { requiresPermission: 'view-book' },
                    },
                    {
                        path: 'create',
                        name: 'books.create',
                        component: CreateBook,
                        meta: { requiresPermission: 'create-book' },
                    },
                    {
                        path: ':id/edit',
                        name: 'books.edit',
                        component: EditBook,
                        props: true,
                        meta: { requiresPermission: 'update-book' },
                    },
                ]
            },
            {
                path: '/calendar',
                name: 'calendar',
                component: CalendarView,
                meta: {
                    title: 'Calendar'
                }
            },
            {
                path: '/profile',
                name: 'profile',
                component: ProfileView,
                meta: {
                    title: 'Profile'
                }
            },
            {path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound},
        ]
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || {left: 0, top: 0}
    }
})

router.beforeEach((to, from, next) => {
    const requiresRole = to.meta.requiresRole;
    const requiresPermission = to.meta.requiresPermission;

    if (requiresRole && Auth().getRole() !== requiresRole) {
        return next('/forbidden');
    }

    if (requiresPermission && !Auth().hasPermission(requiresPermission)) {
        return next('/forbidden');
    }

    if (to.meta.requiresAuth && !Auth().check()) {
        return router.push({name: 'login'})
    }
    next()
})


export default router
