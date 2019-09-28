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
	<title>Sapper project template</title>
</svelte:head>
<script>
	import fire from '../utils/fire'
    import {goto} from '@sapper/app'
	console.log(fire)
	console.log(fire.default.auth().currentUser == null)
    
	fire.default.auth().onAuthStateChanged(function(user) {
		if (user) {
			      authStore.set({ authenticated: true })
		} else {
			      authStore.set({ authenticated: false })
		}
	});

</script>
<h1>Proof of beer</h1>
<button>Start</button>
<p>-------------------</p>
<button>backup</button>
<button>Recover</button>
