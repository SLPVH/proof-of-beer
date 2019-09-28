<script>
    import fire from '../../utils/fire'
    console.log(fire.default)
    const end_event = fire.default.functions().httpsCallable('end_event')

    const handleClick = async () => {
        console.log("ending event")
        const txio = await end_event()
        console.log(txio)
    }
</script>
<h1>End Event</h1>
<button on:click="{handleClick}">End event</button>