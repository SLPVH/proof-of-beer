<script>
    import fire from '../../utils/fire'
    const add_beer = fire.default.functions().httpsCallable('mint_beer')
    
    let quantity="", dst_slpaddr=""

    const handleClick = async () => {
        console.log(quantity, dst_slpaddr)
        const txio = await add_beer({quantity, dst_slpaddr})
        console.log(txio)
    }

</script>
<div class="card">
    <div class="card-body">
        <h2>Add Beer</h2>
        <p>How many?</p>
        <input bind:value="{quantity}" type=number/>
        <p>BCH address:</p>
        <input bind:value="{dst_slpaddr}"/>
        <p></p>
        <button class="btn btn-primary" on:click="{handleClick}">Add</button>
    </div>
</div>
