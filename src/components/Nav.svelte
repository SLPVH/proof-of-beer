<script>
	import { authStore } from '../stores/auth'
	import fire from '../utils/fire'

	let email = ''
	let password = ''

	const signOut = function() {
		console.log("signOut")
		fire.default.auth().signOut()
		authStore.set({ authenticated: false})
	}

	const signIn = function() {
		console.log("signIn")
		console.log(email)
		console.log(password)
		fire.default.auth().signInWithEmailAndPassword(email, password)
		.catch((error) => {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			// ...
			authStore.set({ authenticated: false})
			alert(errorMessage)
		});
		authStore.set({ authenticated: true})
	}

	export let segment;

</script>
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
<style>
	nav {
		border-bottom: 1px solid rgba(255,62,0,0.1);
		font-weight: 300;
		padding: 0 1em;
	}

	ul {
		margin: 0;
		padding: 0;
	}

	/* clearfix */
	ul::after {
		content: '';
		display: block;
		clear: both;
	}

</style>

<nav>
{#if $authStore.authenticated}
  	<button on:click={signOut} type="buton" class="btn btn-secondary">Sign out</button>
  {:else}
    <div class="alert alert-primary" role="alert">Sign in to start &mdash; or ask to join our beta.</div>
    <div class="input-group mb-3" style="width: 50em;">
	<input bind:value={email} type="email" class="form-control"
        placeholder="E-mail" aria-label="E-mail" aria-describedby="basic-addon1">
	<input bind:value={password} type="password" class="form-control"
        placeholder="Password" aria-label="Password" aria-describedby="basic-addon1">
	<button type="button" on:click={signIn} class="btn btn-primary"> Sign in </button>
    </div>
  {/if}
</nav>
