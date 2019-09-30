
<script>
    import fire from '../../utils/fire'
    import {goto} from '@sapper/app'
    const create_token = fire.default.functions().httpsCallable('create_token')
    
    let name="", ticker="", url="", price=0

    const createevent = async () => {
        console.log(name, ticker, url, price)
        const txio = await create_token({token_name:name, token_symbol:ticker, price, url})
        console.log(txio)
        goto('/')
    }

    const history = fire.default.functions().httpsCallable('get_history')

    const asd = async () => {
        const res = await history()
        console.log(res)
    }
</script>
<style>
.main {
    display: flex;
    flex-direction: row;
}
</style>
<div class="main">
    <div class="card">
        <div class="card-body">
            <h2>Create Event</h2>
            <p>Name:</p>
            <input bind:value="{name}"/>
            <p>Ticker(optional):</p>
            <input bind:value="{ticker}">
            <p>URL(optional):</p>
            <input bind:value="{url}"/>
            <p>Price for one beer:</p>
            <input bind:value="{price}"/>
            <p></p>
            <button class="btn btn-primary" on:click="{createevent}">Create token</button>
        </div>
    </div>
</div>
<button class="btn btn-primary" on:click="{asd}">get history</button>