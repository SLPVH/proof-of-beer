
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

<style>
	h1, p {
		text-align: center;
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		text-transform: uppercase;
		font-weight: 700;
		margin: 0 0 0.5em 0;
	}

	p {
		margin: 1em auto;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}
</style>
<script context="module">
	export async function preload(page, session) {
		if (fire.default.auth().currentUser != null) {
				  authStore.set({ authenticated: true })

		}
		return "asd"
	}
</script>

<svelte:head>
	<title>Proof of Beer &mdash; the crowdsourced bar</title>
</svelte:head>
<script>
	import { authStore } from '../stores/auth'
	import { userStore, tokenidStore, cashaddrStore, slpaddrStore, tokennameStore, historyStore } from '../stores/user'
	import fire from '../utils/fire'
	import {goto} from '@sapper/app'

	fire.default.auth().onAuthStateChanged(function(user) {
		if (!user) {
            authStore.set({ authenticated: false })
            return;
        }
        authStore.set({ authenticated: true })

        const save_nested_to_store = (parentkey, key, store) => {
            fire.default.database().ref('users').child(user.uid)
                .child(parentkey).child(key).once('value')
                .then(function(snapshot) {
                    store.set(snapshot.val())
                });
        };

        const save_to_store = (key, store) => {
            fire.default.database().ref('users').child(user.uid)
                .child(key).once('value')
                .then(function(snapshot) {
                    store.set(snapshot.val())
                });
        };

        save_nested_to_store('event', 'txid', tokenidStore)
        save_nested_to_store('event', 'token_name', tokennameStore)
        save_to_store('cash_addr', cashaddrStore)
        save_to_store('slp_addr', slpaddrStore)



			/* fire.default.database().ref('users').child(user.uid).child('event')
				.update({ eventName: "eventName"})*/

		});
        const history = fire.default.functions().httpsCallable('get_history')

        const update_history = async () => {
            try {
                let h = await history()
                console.log(h.data.res)
                historyStore.set(h.data.res)
            }
            catch (e) {
                console.log(e)
            }
        }


</script>
{#if !$authStore.authenticated}
<div class="jumbotron">
  <h1 class="display-4">Proof of Beer &mdash; The crowdsourced bar!</h1>
    <p class="lead">Keep the beer flowing at your event. Share the cost. Share the reward.</p>
      <hr class="my-4">
        <p>Have your friends help fill the fridge. For each beer they contribute, they will receive a proof-of-beer token to their Bitcoin Cash wallet.</p>

        <p>Your attendees may pay for their drinks in Bitcoin Cash &mdash; or they may pay with a proof-of-beer token.</p>

        <p>At the end of the event, all income will be paid as divident to remaining token holders</p>
          <a class="btn btn-primary btn-lg" href="/#" role="button">Join the BETA</a>
          </div>
{:else}
{#if !$tokenidStore}
<div class="card">
  <div class="card-body">
      <h5 class="card-title">Start an event</h5>
      <p class="card-text">You don't have an event running. Start by creating an event.</p>
      <a href="/create" class="btn btn-primary">Create an event</a>
  </div>
</div>
{:else}
<div class="container">
<div class="row">
<div class="col-sm-6">


<div class="card" style="width: 400px;">
  <div class="card-header">Bitcoin Cash</div>
  <div class="card-body">
     <h5 class="card-title">Buy beer with Bitcoin Cash</h5>
    <div class="card-text"><img src="https://api.qrserver.com/v1/create-qr-code/?qzone=3&size=350x350&data={$cashaddrStore}" alt="bch QR"><br />
   <span style="font-size: 60%"><a href="https://explorer.bitcoin.com/bch/address/{$cashaddrStore}">{$cashaddrStore}</a></span>

    </div>
</div> <!-- card-body -->
</div> <!-- card -->

</div> <!-- col-sm -->

<div class="col-sm-6">

<div class="card" style="width: 400px">
  <div class="card-header">{$tokennameStore}</div>
  <div class="card-body">
     <h5 class="card-title">{$tokennameStore}</h5>
    <div class="card-text"><img src="https://api.qrserver.com/v1/create-qr-code/?qzone=3&size=350x350&data={$slpaddrStore}" alt="bch QR"><br />
   <span style="font-size: 60%"><a href="https://explorer.bitcoin.com/bch/address/{$slpaddrStore}">{$slpaddrStore}</a></span>
    </div>
</div> <!-- card-body -->
</div> <!-- card -->

</div> <!-- col-sm -->
</div> <!-- row -->
</div> <!-- container -->

<ul class="nav nav-pills">
  <li class="nav-item">
    <a class="nav-link " href="/add">➕ Mint beer</a>
  </li>
  <li class="nav-item">
    <a class="nav-link " href="/end">🙅 End event</a>
  </li>
  <li class="nav-item">
<button on:click={update_history} type="buton" class="btn ">🍻 Update history</button>
    </li>
</ul>


<div class="list-group" style="margin-top: 1em;">

{#each $historyStore as entry}

 <a href="/#" class="list-group-item list-group-item-action">
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1">{entry.type}</h5>
      <small class="text-muted">Moments ago</small>
    </div>

    {#each entry.outputs as o}
    <p class="mb-1">{o.str}</p>
    {/each}

    <small class="text-muted">Cheers!</small>
  </a>
{/each}
</div> <!-- list group -->

{/if}
{/if}
