import axios from "axios";

// authentication related information
export default new class {
    constructor() {
        // local auth 
        this.localAuth = {
            email: "",
            password: "",
            loginMsg: "",
            signupMsg: ""
        };

        // three status: UNKNOWN, SUCCESS, FAIL
        // method currently only support local
        this.authResult = {
            authenticated : false,
            method: "UNKNOWN",
            loggedinUser: "UNKNOWN"
        }
    }

    authReset() {
        // local auth 
        this.localAuth = {
            email: "",
            password: "",
            loginMsg: "",
            signupMsg: ""
        };

        // three status: UNKNOWN, SUCCESS, FAIL
        // method currently only support local
        this.authResult = {
            authenticated : false,
            method: "UNKNOWN",
            loggedinUser: "UNKNOWN"
        }
    }

    // check if already authenticated
    async isAuth() {
        let self = this;
        await axios
            .get("/isloggedin")
            .then(function (response) {
                console.log(response.data.user);
                if (!response.data.user) {
                    console.log("unknown");
                    self.authResult.authenticated = false;
                    self.authResult.method = "UNKNOWN";
                    self.authResult.loggedinUser = "UNKNOWN";
                } else if (response.data.user.local) {
                    console.log("local");
                    self.authResult.authenticated = true;
                    self.authResult.method = "local";
                    self.authResult.loggedinUser = response.data.user.local.email;
                } else {
                    console.log("other");
                    self.authResult.authenticated = true;
                    self.authResult.method = "UNKNOWN";
                    self.authResult.loggedinUser = response.data.user.local.email;
                }
                console.log(self);
            });
            console.log(this);
    }

    // set local auth
    setLocalAuth(authItem, authValue) {
        this.localAuth[authItem] = authValue;
    }

    // request local auth login
    async reqLocalAuthLogin() {
        let self = this;
        await axios.post("/local/login", {
            email: this.localAuth.email,
            password: this.localAuth.password,
        }).then(function (response) {
            self.localAuth.loginMsg = response.data.message;
            self.localAuth.signupMsg = "";
            self.authResult.authenticated = ((response.data.loginStatus === "SUCCESS") ? true : false);
            self.authResult.method = "local";
            self.authResult.loggedinUser = self.localAuth.email;
        })
    }

    // request local auth sign up
    async reqLocalAuthSignUp() {
        let self = this;
        await axios.post("/local/signup", {
            email: this.localAuth.email,
            password: this.localAuth.password
        }).then(function (response) {
            self.localAuth.loginMsg = "";
            self.localAuth.signupMsg = response.data.message;
            self.authResult.authenticated = ((response.data.signupStatus === "SUCCESS") ? true : false);
            self.authResult.method = "local";
            self.authResult.loggedinUser = self.localAuth.email;
        });
    }
};