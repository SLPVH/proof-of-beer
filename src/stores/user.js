import { writable } from 'svelte/store'

export const userStore = writable({
    cash_addr: "",
    slp_addr: "",
    token_id: ""
})

export const tokenidStore = writable()
export const cashaddrStore = writable()
export const slpaddrStore = writable()
export const tokennameStore = writable()
export const mintStore = writable()
export const historyStore = writable([])
