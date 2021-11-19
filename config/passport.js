const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
var GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/user')
const bcrypt = require('bcryptjs')
module.exports = app => {
  // 初始化 Passport 模組
  app.use(passport.initialize())
  app.use(passport.session())
  // 設定本地登入策略
  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          req.flash('error_messages', '這個信箱尚未註冊。')
          return done(null, false, { message: 'That email is not registered!' })
        }
        bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              req.flash('error_messages', '信箱或密碼輸入不正確。')
              return done(null, false, { message: 'Email or Password incorrect.'})
            }
            return done(null, user)
          })
      })
      .catch(err => done(err, false))
  }))
  // 設定序列化與反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
   //設定Facebook登入策略
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, (accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json
    User.findOne({ email })
      .then(user => {
        if (user) return done(null, user)
        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name,
            email,
            password: hash
          }))
          .then(user => done(null, user))
          .catch(err => done(err, false))
      })
  }))
  //設定google登入策略
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_callbackURL
  },
    async (accessToken, refreshToken, profile, done) => {
        try {
          const googleId = profile.id
          const { name, email } = profile._json
          let user = await User.findOne({ googleId })
          if (user) return done(null, user)
          user = await User.findOne({ email })
          if (user) {
            Object.assign(user, { googleId })
            user = await user.save()
            return done(null, user)
          }
          const randomPassword = Math.random().toString(36).slice(-10)
          const salt = await bcrypt.genSalt(10)
          const hash = await bcrypt.hash(randomPassword, salt)
          user = await User.create({ name, email, password: hash, googleId })
          return done(null, user)
        } catch (err) {
          console.log(err)
          done(err, false)
        }
      }
  ))
  //設定GitHub登入策略
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_callbackURL
  },
  async (accessToken, refreshToken, profile, done) => {
        try {
          const githubId = profile.id
          const name = profile.username
          const email = profile.profileUrl
          let user = await User.findOne({ githubId })
          if (user) return done(null, user)
          user = await User.findOne({ email })
          if (user) {
            Object.assign(user, { githubId })
            user = await user.save()
            return done(null, user)
          }
          const randomPassword = Math.random().toString(36).slice(-10)
          const salt = await bcrypt.genSalt(10)
          const hash = await bcrypt.hash(randomPassword, salt)
          user = await User.create({ name, email, password: hash, githubId })
          return done(null, user)
        } catch (err) {
          console.log(err)
          done(err, false)
        }
      }
  ))
}