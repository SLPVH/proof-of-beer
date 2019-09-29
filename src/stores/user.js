import { writable } from 'svelte/store'

export const userStore = writable({ 
    cash_addr: "",
    slp_addr: "",
    token_id: ""
})
