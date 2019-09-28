let slputil = require("./slputil")

exports.createUserData = functions.auth.user().onCreate((user) => {
    let SLP = slputil.get_slpsdk()

    const private_key = function gen_privkey() {
        let mnemonic = SLP.Mnemonic.generate()
        let rootseed = SLP.Mnemonic.toSeed(mnemonic)
        let hdnode = SLP.HDNode.fromSeed(rootseed)
        const account = SLP.HDNode.derivePath(hdnode, "m/44'/145'/0'")
        const privkey = SLP.HDNode.toWIF(account)
        return privkey
    }
    
    const [cash_addr, slp_addr] = slputil.priv_to_publickey(SLP, private_key)

    firebase.database().ref('users/' + userId).set({
        private_key: private_key,
        cash_addr: cash_addr,
        slp_addr: slp_addr,
        email: user.email
      });

  });

