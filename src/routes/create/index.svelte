<script>
    import fire from '../../utils/fire'
    console.log(fire.default)
    const create_token = fire.default.functions().httpsCallable('create_token')
    
    let name="", ticker="", url="", price=0

    const handleClick = () => {
        console.log(name, ticker, url, price)
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