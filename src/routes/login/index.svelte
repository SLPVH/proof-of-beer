
<style>
</style>

<svelte:head>
	<title>Login</title>
</svelte:head>

<script>

    import fire from '../../utils/fire'
    import {goto} from '@sapper/app'

    console.log(fire)
    
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

<h1>Login page</h1>

<p>hey bro, sign in</p>
<button on:click={signIn}>sign in</button>