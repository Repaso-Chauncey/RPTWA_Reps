const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./database');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('🔍 Google OAuth profile received:', profile.id, profile.emails[0].value);

      // Check if user exists
      const [users] = await db.query(
        'SELECT * FROM users WHERE google_id = ?',
        [profile.id]
      );

      if (users.length > 0) {
        console.log('✅ Existing user found:', users[0].email);
        return done(null, users[0]);
      }

      // Create new user
      const email = profile.emails[0].value;
      const username = profile.displayName.replace(/\s+/g, '_').toLowerCase();
      const profilePicture = profile.photos[0]?.value;

      console.log('📝 Creating new user:', email);

      const [result] = await db.query(
        'INSERT INTO users (username, email, google_id, profile_picture) VALUES (?, ?, ?, ?)',
        [username, email, profile.id, profilePicture]
      );

      const [newUser] = await db.query(
        'SELECT * FROM users WHERE id = ?',
        [result.insertId]
      );

      console.log('✅ New user created:', newUser[0].email);
      return done(null, newUser[0]);
    } catch (error) {
      console.error('❌ Google OAuth error:', error);
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, users[0]);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
