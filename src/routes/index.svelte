
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
	import { userStore } from '../stores/user'
	import fire from '../utils/fire'
	import {goto} from '@sapper/app'

	fire.default.auth().onAuthStateChanged(function(user) {
		if (user) {
			authStore.set({ authenticated: true })

			console.log("lolol")
			console.log(user.uid)
			fire.default.database().ref('users').child(user.uid).child('cash_addr').once('value')
				.then(function(snapshot) {
					var cashAddr = snapshot.val()
					console.log(cashAddr)
					userStore.set({
						cash_addr: cashAddr,
					})
				});

			fire.default.database().ref('users').child(user.uid).child('event')
				.update({ eventName: "eventName"})

		} else {
			      authStore.set({ authenticated: false })
		}
	});

</script>
{#if !$authStore.authenticated}
<div class="jumbotron">
  <h1 class="display-4">Proof of Beer &mdash; The crowdsourced bar!</h1>
    <p class="lead">Keep the beer flowing at your event. Share the cost. Share the reward.</p>
      <hr class="my-4">
        <p>Have your friends help fill the fridge. For each beer they contribute, they will receive a proof-of-beer token to their Bitcoin Cash wallet.</p>

        <p>Your attendees may pay for their drinks in Bitcoin Cash &mdash; or they may pay with a proof-of-beer token.</p>

        <p>At the end of the event, all income will be paid as divident to remaining token holders</p>
          <a class="btn btn-primary btn-lg" href="#" role="button">Join the BETA</a>
          </div>
{/if}
