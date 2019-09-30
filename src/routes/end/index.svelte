<script>
    import fire from '../../utils/fire'
    import {goto} from '@sapper/app'

    const end_event = fire.default.functions().httpsCallable('end_event')

    const endevent = async () => {
        console.log("ending event")
        const txio = await end_event()
        console.log(txio)
        goto('/')
    }
    const back = async () => {
        goto('/')
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
            <h2>End Event</h2>
            <button class="btn btn-primary" on:click="{endevent}">End event</button>
        </div>
    </div>
    <div class="card">
        <div class="card-body">
            <h2>Back to dashboard</h2>
            <button class="btn btn-primary" on:click="{back}">Back</button>
        </div>
    </div>
</div>