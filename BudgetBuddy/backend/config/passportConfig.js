const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userService = require("../src/services/userService");
require("dotenv").config();

passport.use(
	new GoogleStrategy(
		{
			clientID:
				x,
			clientSecret: "",
			callbackURL: "",
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				let user = await userService.findUser(profile.emails[0].value);
				if (!user) {
					const newUser = {
						email: profile.emails[0].value,
						username:
							profile.displayName +
							Math.floor(Math.random() * 10000),
					};
					user = await userService.createUser(newUser);
				}

				done(null, user);
			} catch (error) {
				done(error, null);
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});
passport.deserializeUser((user, done) => {
	done(null, user);
});

module.exports = passport;
