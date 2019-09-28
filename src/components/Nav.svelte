<script>
	import { authStore } from '../stores/auth'
	import fire from '../utils/fire'
	export let segment;

	let email = ''
	let password = ''

	const signOut = () => {
		fire.default.auth().signout()
	}

	const signIn = () => {
		fire.default.auth().signInWithEmailAndPassword(email, password).catch((error) => {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			// ...
		});
	}
</script>

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

	li {
		display: block;
		float: left;
	}

	.selected {
		position: relative;
		display: inline-block;
	}

	.selected::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		height: 2px;
		background-color: rgb(254,62,0);
		display: block;
		bottom: -1px;
	}

	a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
	}
</style>

<nav>
{#if $authStore.authenticated}
  	<button on:click={signOut}> Sign out </button>
  {:else}
	<p>Email:</p>
	<input value={email} type="email" />
	<p>Password:</p>
	<input value={password} type="password" />
	<button on:click={signIn}> Sign in </button>
  {/if}

		
	<ul>
		{#if $authStore.authenticated}
		<li><a class='{segment === undefined ? "selected" : ""}' href='.'>start</a></li>
		<li><a class='{segment === "create" ? "selected" : ""}' href='create'>create token</a></li>
		<li><a class='{segment === "add" ? "selected" : ""}' href='add'>add beer</a></li>
		{/if}
		<li><a class='{segment === "about" ? "selected" : ""}' href='about'>about</a></li>
		
	</ul>
</nav>