<script>
    import fire from '../../utils/fire'
    console.log(fire.default)
    const create_token = fire.default.functions().httpsCallable('create_token')
    
    let name="", ticker="", url="", price=0, priv="L4BwXDmjzEyzKHbAfGruhieUDPs8KTx7DMgqPk4aF9GefzgqPENV"

    const handleClick = async () => {
        console.log(name, ticker, url, price)
        const txio = await create_token({privkey_wif:priv, token_name:name, token_symbol:ticker})
        console.log(txio)
    }
</script>
<p>Name:</p>
<input bind:value="{name}"/>
<p>Ticker(optional):</p>
<input bind:value="{ticker}">
<p>URL(optional):</p>
<input bind:value="{url}"/>
<p>Price for one beer:</p>
<input bind:value="{price}"/>
<p>-------------------</p>
<button on:click="{handleClick}">Create token</button>