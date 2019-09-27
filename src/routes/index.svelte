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

		if (fire.default.auth().currentUser == null) {
			return this.redirect(302, 'login');
		}
		return "asd"
	}
</script>

<svelte:head>
	<title>Sapper project template</title>
</svelte:head>
<script>
	import fire from '../utils/fire'
    import {goto} from '@sapper/app'
	console.log(fire)
	console.log(fire.default.auth().currentUser == null)
    
	fire.default.auth().onAuthStateChanged(function(user) {
		if (user) {
			console.log("SIGNED IN")
		} else {
			goto('login')
		}
	});

	const signIn = () => fire.default.auth().signInWithEmailAndPassword("asd@asd.com", "asdasd").then(function(){
		goto('.')
	}).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// ...
		console.log(errorCode)
		console.log(errorMessage)
	})
</script>
<h1>Great success!</h1>
<h2>HIGH FIVE BRO</h2>
<button on:click={signIn}>sign in</button>

<p>asd</p>