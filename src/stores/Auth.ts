import { ref } from 'vue'
import { defineStore } from 'pinia'
import {useStorage} from '@vueuse/core'

export const Auth = defineStore('user', () => {
    let user: any = useStorage('user', ref(null))

    function login(AuthenticatedUsers: any) {
        user.value = JSON.stringify(AuthenticatedUsers);
    }

    function check() {
        return user.value !== null;
    }

    function logout() {
        return user.value = null;
    }

    function getRole() {
        if (user.value) {
            const parsedUser = JSON.parse(user.value)
            return parsedUser.roles[0].name || null
        }
        return null
    }

    function getPermissions() {
        if (user.value) {
            const parsedUser = JSON.parse(user.value)
            return parsedUser.roles[0].permissions.map(permission => permission.name) || []
        }
        return []
    }

    function hasPermission(permission: string) {
        const permissions = getPermissions()
        return permissions.includes(permission)
    }

    return { check, login, logout, user, getRole, getPermissions, hasPermission }
})
